var request = require('supertest');
var app = require("../app.js");
var async = require('async');
var { clone } = require('../utils/objectUtilities.js');
// First case.
describe("POST-/shipments/:serviceID wrong serviceID", function () {
    it("returns a respose with Content-Type: text/plain", function (done) {
        async.series([
            (cb) => {
                request(app).post("/shipments/someService").expect("Content-Type", /text\/plain/).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/123').expect("Content-Type", /text\/plain/).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/-').expect("Content-Type", /text\/plain/).end((err, res) => { if (err) throw err }); cb();
            }
        ], done);
    });

    it("returns a respose with status code: 400", function (done) {
        async.series([
            (cb) => {
                request(app).post("/shipments/someService").expect(400).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/123').expect(400).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/-').expect(400).end((err, res) => { if (err) throw err }); cb();
            }
        ], done);
    });

    it("returns a respose with correct failure response body", function (done) {
        async.series([
            (cb) => {
                request(app).post("/shipments/someService")
                    .expect(function (res) {
                        if (res.text !== "You can not POST shipments with this service ID in the request.params. Service ID should be one of the following: [fedex,ups].")
                            throw new Error("Response body not correct.");
                    })
                    .end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/123')
                    .expect(function (res) { if (res.text !== "You can not POST shipments with this service ID in the request.params. Service ID should be one of the following: [fedex,ups].") throw new Error("Response body not correct."); })
                    .end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/-')
                    .expect((res) => { if (res.text !== "You can not POST shipments with this service ID in the request.params. Service ID should be one of the following: [fedex,ups].") throw new Error("Response body not correct."); })
                    .end((err, res) => { if (err) throw err }); cb();
            }
        ], done);
    });
});

// Third case.
describe("POST-/shipments/:serviceID correct serviceID and correct request body", function () {

    it('returns a response with Content-type: text/plain', function (done) {
        async.series([
            (cb) => {
                request(app).post("/shipments/fedex").send(fedexG).expect("Content-Type", /text\/plain/).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/fedex').send(fedexA).expect("Content-Type", /text\/plain/).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/ups').send(upsDay).expect("Content-Type", /text\/plain/).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/ups').send(upsExpress).expect("Content-Type", /text\/plain/).end((err, res) => { if (err) throw err }); cb();
            }
        ], done);
    });

    it('returns a response with status code: 200', function (done) {
        async.series([
            (cb) => {
                request(app).post("/shipments/fedex").send(fedexG).expect(200).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/fedex').send(fedexA).expect(200).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/ups').send(upsDay).expect(200).end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/ups').send(upsExpress).expect(200).end((err, res) => { if (err) throw err }); cb();
            }
        ], done);
    });

    it('returns a response with correct success response body', function (done) {
        async.series([
            (cb) => {
                request(app).post("/shipments/fedex").send(fedexG).expect(function (res) {
                    if (res.text !== "Shipment to fedex completed successfully!")
                        throw new Error("Response body not correct.");
                })
                    .end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/fedex').send(fedexA).expect(function (res) {
                    if (res.text !== "Shipment to fedex completed successfully!")
                        throw new Error("Response body not correct.");
                })
                    .end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/ups').send(upsDay).expect(function (res) {
                    if (res.text !== "Shipment to ups completed successfully!")
                        throw new Error("Response body not correct.");
                })
                    .end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                request(app).post('/shipments/ups').send(upsExpress).expect(function (res) {
                    if (res.text !== "Shipment to ups completed successfully!")
                        throw new Error("Response body not correct.");
                })
                    .end((err, res) => { if (err) throw err }); cb();
            }
        ], done);
    });
});

// Correct response body.
var fedexG = {
    carrierServiceID: 'fedexGround',
    packageDetails: {
        width: {
            value: 2,
            unit: "cm"
        },
        height: {
            value: 2,
            unit: "cm"
        },
        length: {
            value: 2,
            unit: "cm"
        },
        weight: {
            value: 2,
            unit: "gram"
        }
    }
},
    upsDay = {
        shipmentServiceID: 'UPS2DAY',
        package: {
            width: {
                value: 2,
                unit: "inch"
            },
            height: {
                value: 2,
                unit: "inch"
            },
            length: {
                value: 2,
                unit: "inch"
            },
            weight: {
                value: 2,
                unit: "pound"
            }
        }
    },
    fedexA = (function () { var temp = clone(fedexG); temp.carrierServiceID = 'fedexAIR'; return temp; })(),
    upsExpress = (function () { var temp = clone(upsDay); temp.shipmentServiceID = 'UPSExpress'; return temp; })();

module.exports = {
    fedexA, fedexG, upsDay, upsExpress
};