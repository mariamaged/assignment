var { upsDay, upsExpress } = require('./POSTShipment.js');
var request = require('supertest');
var app = require("../app.js");
var async = require('async');
var { clone, compareEquality } = require('../utils/objectUtilities.js');

var upsDay1, upsExpress1;
describe("Ups non package information validations", function () {
    // After each test changing a small attribute of the correct body, reassign a fresh copy of the body to the variables again.
    beforeEach(function () {
        upsExpress1 = (function () { return clone(upsExpress); })();
        upsDay1 = (function () { return clone(upsDay); })();
    });

    it('detects the absence of shipmentServiceID.', function (done) {
        var validation = [
            { message: '"shipmentServiceID" is required', property: 'shipmentServiceID' }];

        async.series([
            (cb) => {
                delete upsExpress1.shipmentServiceID;

                request(app)
                    .post("/shipments/ups")
                    .send(upsExpress1)
                    .expect(400)
                    .expect("Content-Type", /application\/json/)
                    .expect(function (res) {
                        var err = res.body.missingFieldsErrors;
                        if (!(err.length === 1 &&
                            (err[0].hasOwnProperty('message') && err[0].hasOwnProperty('property') &&
                                err[0].message === validation[0].message && err[0].property === validation[0].property)))
                            throw new Error('Response body not correct.');
                    })
                    .end((err, res) => { if (err) throw err }); cb();
            }
        ], done);
    });

    it('detects the absence of package.', function (done) {
        var validation = [
            { message: '"package" is required', property: 'package' }];

        async.series([
            (cb) => {
                delete upsExpress1.package;

                request(app)
                    .post("/shipments/ups")
                    .send(upsExpress1)
                    .expect(400)
                    .expect("Content-Type", /application\/json/)
                    .expect(function (res) {
                        var err = res.body.missingFieldsErrors;
                        if (!(err.length === 1 &&
                            (err[0].hasOwnProperty('message') && err[0].hasOwnProperty('property') &&
                                err[0].message === validation[0].message && err[0].property === validation[0].property)))
                            throw new Error('Response body not correct.');
                    })
                    .end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                delete upsDay1.package;

                request(app)
                    .post('/shipments/ups')
                    .send(upsDay1)
                    .expect(400)
                    .expect("Content-Type", /application\/json/)
                    .expect(function (res) {
                        var err = res.body.missingFieldsErrors;
                        if (!(err.length === 1 &&
                            (err[0].hasOwnProperty('message') && err[0].hasOwnProperty('property') &&
                                err[0].message === validation[0].message && err[0].property === validation[0].property)))
                            throw new Error('Response body not correct.');
                    })
                    .end((err, res) => { if (err) throw err }); cb();
            }
        ], done);

    });

    it('does not allow the shipmentServiceID to be non string and unequal to either UPS2DAY or UPSExpress. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value 2.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: 2, property: 'shipmentServiceID' },
                { message: 'Service type should be from the following list: UPS2DAY,UPSExpress.', invalidValue: 2, property: 'shipmentServiceID' }];

            async.series([
                (cb) => {
                    upsExpress1.shipmentServiceID = 2;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsExpress1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1 && err[0].message.length === 2 &&
                                (compareEquality(err[0], validation[0], false)) &&
                                (err[0].message[0] === validation[0].message || err[0].message[0] === validation[1].message) &&
                                (err[0].message[1] === validation[0].message || err[0].message[1] === validation[1].message)))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb();
                }
            ], done);
        });

    it('does not allow the shipmentServiceID to be non string and unequal to either UPS2DAY or UPSExpress. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value null.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: null, property: 'shipmentServiceID' },
                { message: 'Service type should be from the following list: UPS2DAY,UPSExpress.', invalidValue: 2, property: 'shipmentServiceID' }];

            async.series([
                (cb) => {
                    upsExpress1.shipmentServiceID = null;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsExpress1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1 && err[0].message.length === 2 &&
                                (compareEquality(err[0], validation[0], false)) &&
                                (err[0].message[0] === validation[0].message || err[0].message[0] === validation[1].message) &&
                                (err[0].message[1] === validation[0].message || err[0].message[1] === validation[1].message)))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb();
                }
            ], done);
        });

    it('does not allow the shipmentServiceID to be non string and unequal to either UPS2DAY or UPSExpress. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value false.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: false, property: 'shipmentServiceID' },
                { message: 'Service type should be from the following list: UPS2DAY,UPSExpress.', invalidValue: 2, property: 'shipmentServiceID' }];

            async.series([
                (cb) => {
                    upsExpress1.shipmentServiceID = false;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsExpress1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1 && err[0].message.length === 2 &&
                                (compareEquality(err[0], validation[0], false)) &&
                                (err[0].message[0] === validation[0].message || err[0].message[0] === validation[1].message) &&
                                (err[0].message[1] === validation[0].message || err[0].message[1] === validation[1].message)))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb();
                }
            ], done);
        });

    it('does not allow the shipmentServiceID to be unequal to either UPS2DAY or UPSExpress. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "someupsService".', function (done) {
            var validation = [
                { message: 'Service type should be from the following list: UPS2DAY,UPSExpress.', invalidValue: "someupsService", property: 'shipmentServiceID' }];

            async.series([
                (cb) => {
                    upsExpress1.shipmentServiceID = "someupsService";

                    request(app)
                        .post("/shipments/ups")
                        .send(upsExpress1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1
                                && (compareEquality(err[0], validation[0], true))))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb();
                }
            ], done);
        });

    it('does not allow the shipmentServiceID to be unequal to either UPS2DAY or UPSExpress. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "fedexGround".', function (done) {
            var validation = [
                { message: 'Service type should be from the following list: UPS2DAY,UPSExpress.', invalidValue: "fedexGround", property: 'shipmentServiceID' }];

            async.series([
                (cb) => {
                    upsExpress1.shipmentServiceID = "fedexGround";

                    request(app)
                        .post("/shipments/ups")
                        .send(upsExpress1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1
                                && (compareEquality(err[0], validation[0], true))))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb();
                }
            ], done);
        });
});
