var http = require("http");
var express = require("express");
var logger = require("morgan");
var mongoose = require('mongoose');
var { ErrorFactory, allowedServices } = require('./validator.js');
var ShipmentModel = require("./models/shipment.js");

require('dotenv').config()
var app = express();

app.set("port", process.env.PORT || 3000);

app.use(logger("dev"));
app.use(express.json());

app.post("/shipments/:serviceID", async function (request, response) {
    const serviceID = request.params.serviceID, req = request.body;

    // Case 1: Service ID not allowed.
    if (!allowedServices.includes(serviceID))
        return response.status(400).send(ErrorFactory.createError({ endpoint: request.method + '-' + request.url }));

    var factory = ErrorFactory.createError({ endpoint: request.method + '-' + request.url, serviceID: serviceID });
    var result = factory.schema.validate(req, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    });

    // Case 2: Request body has validation errors and/or missing fields.
    if (result.error)
        return response.status(400).json(factory.updateErrorMessages(result.error.details));

    // Case 3: Shipment added to database and a success response message sent back.
    var serviceType = req[factory.propertyNames.serviceType], packageInfo = req[factory.propertyNames.packageInfo];
    await new ShipmentModel(
        {
            serviceID: serviceID, serviceType: serviceType,
            widthUnit: packageInfo.width.unit, widthValue: packageInfo.width.value,
            heightUnit: packageInfo.height.unit, heightValue: packageInfo.height.value,
            lengthUnit: packageInfo.length.unit, lengthValue: packageInfo.length.value,
            weightUnit: packageInfo.weight.unit, weightValue: packageInfo.weight.value
        }).save();
    response.status(200).send(`Shipment to ${serviceID} completed successfully!`);
});

app.get("/shipments", async function (request, response) {
    const serviceID = request.query.serviceID;

    // Case 1: Service ID not allowed..
    if (serviceID && !allowedServices.includes(serviceID))
        return response.status(400).send(ErrorFactory.createError({ endpoint: request.method + '-' + request.url }));

    var shipments;
    // Case 2: A service ID was specified. Return shipments related to that service only. Exclude the serviceID from each shipment object.
    if (serviceID) {
        shipments = await ShipmentModel.find({ serviceID: serviceID }).lean();
        shipments = shipments.map((shipment) => {
            const { __v, _id, serviceID, ...updatedShipment } = shipment; return updatedShipment;
        });
    }
    // Case 3: A service ID was not specified. Return all shipments. Attach the serviceID to each shipment object.
    else {
        shipments = await ShipmentModel.find({}).lean();
        shipments = shipments.map((shipment) => {
            const { __v, _id, ...updatedShipment } = shipment; return updatedShipment;
        });
    }

    if (shipments.length != 0) response.status(200).send(shipments);
    else response.status(200).end();
});

app.use(function (request, response) {
    response.status(404).send("404");
});

http.createServer(app).listen(app.get("port"), function () {
    console.log("Shipment app started on port " + app.get("port"));
});

try {
    mongoose.connect(process.env.MONGO_ATLAS_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log("Mongoose is connected"));

} catch (e) {
    console.log("Could not connect to the database");
}