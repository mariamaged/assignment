var http = require("http");
var express = require("express");
var logger = require("morgan");
var mongoose = require('mongoose');
var { fedexSchema, upsSchema, updateErrorMessages } = require('./validator.js');
var ShipmentModel = require("./models/shipment.js");

require('dotenv').config()
var app = express();

let map = {
    fedex: {
        schema: fedexSchema,
        serviceType: "carrierServiceID",
        packageInfo: "packageDetails"
    },
    ups: {
        schema: upsSchema,
        serviceType: "shipmentServiceID",
        packageInfo: "package"
    }
}

app.set("port", process.env.PORT || 3000);

app.use(logger("dev"));
app.use(express.json());

app.post("/shipments/:serviceID", async function (request, response) {
    const serviceID = request.params.serviceID, req = request.body;
    if (!(Object.keys(map).includes(serviceID)))
        return response.status(400).send("Service IDs should be one of the following: " + Object.keys(map));

    var serviceDetails = map[serviceID];
    var result = serviceDetails.schema.validate(req, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    });

    if (result.error)
        return response.status(400).json(updateErrorMessages(result.error.details));

    await new ShipmentModel(
        {
            serviceID: serviceID, serviceType: req[serviceDetails.serviceType],
            widthUnit: req[serviceDetails.packageInfo].width.unit, widthValue: req[serviceDetails.packageInfo].width.value,
            heightUnit: req[serviceDetails.packageInfo].height.unit, heightValue: req[serviceDetails.packageInfo].height.value,
            lengthUnit: req[serviceDetails.packageInfo].length.unit, lengthValue: req[serviceDetails.packageInfo].length.value,
            weightUnit: req[serviceDetails.packageInfo].weight.unit, weightValue: req[serviceDetails.packageInfo].weight.value
        }).save();
    response.status(200).send(`Shipment to ${serviceID} completed successfully!`);
});

app.get("/shipments", async function (request, response) {
    const serviceID = request.query.serviceID;
    if (serviceID && !(Object.keys(map).includes(serviceID)))
        return response.status(400).send("Service IDs should be one of the following: " + Object.keys(map));

    var shipments;
    if (serviceID) {
        shipments = await ShipmentModel.find({ serviceID: serviceID }).lean();
    }
    else {
        shipments = await ShipmentModel.find({}).lean();
    }

    shipments = shipments.map((shipment) => {
        const { __v, _id, serviceID, ...updatedShipment } = shipment; return updatedShipment;
    });
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