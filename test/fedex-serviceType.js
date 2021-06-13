var { fedexG, fedexA } = require('./POSTShipment.js');
var request = require('supertest');
var app = require("../app.js");
var async = require('async');
var { clone, compareEquality } = require('../utils/objectUtilities.js');

var fedexG1, fedexA1;
describe("Fedex non package information validations", function () {
    // After each test changing a small attribute of the correct body, reassign a fresh copy of the body to the variables again.
    beforeEach(function () {
        fedexA1 = (function () { return clone(fedexA); })();
        fedexG1 = (function () { return clone(fedexG); })();
    });

    it('detects the absence of carrierServiceID.', function (done) {
        var validation = [
            { message: '"carrierServiceID" is required', property: 'carrierServiceID' }];

        async.series([
            (cb) => {
                delete fedexA1.carrierServiceID;

                request(app)
                    .post("/shipments/fedex")
                    .send(fedexA1)
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

    it('detects the absence of packageDetails.', function (done) {
        var validation = [
            { message: '"packageDetails" is required', property: 'packageDetails' }];

        async.series([
            (cb) => {
                delete fedexA1.packageDetails;

                request(app)
                    .post("/shipments/fedex")
                    .send(fedexA1)
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
                delete fedexG1.packageDetails;

                request(app)
                    .post('/shipments/fedex')
                    .send(fedexG1)
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

    it('does not allow the carrierServiceID to be non string and unequal to either fedexAIR or fedexGround. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value 2.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: 2, property: 'carrierServiceID' },
                { message: 'Service type should be from the following list: fedexAIR,fedexGround.', invalidValue: 2, property: 'carrierServiceID' }];

            async.series([
                (cb) => {
                    fedexA1.carrierServiceID = 2;

                    request(app)
                        .post("/shipments/fedex")
                        .send(fedexA1)
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

    it('does not allow the carrierServiceID to be non string and unequal to either fedexAIR or fedexGround. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value null.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: null, property: 'carrierServiceID' },
                { message: 'Service type should be from the following list: fedexAIR,fedexGround.', invalidValue: 2, property: 'carrierServiceID' }];

            async.series([
                (cb) => {
                    fedexA1.carrierServiceID = null;

                    request(app)
                        .post("/shipments/fedex")
                        .send(fedexA1)
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

    it('does not allow the carrierServiceID to be non string and unequal to either fedexAIR or fedexGround. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value false.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: false, property: 'carrierServiceID' },
                { message: 'Service type should be from the following list: fedexAIR,fedexGround.', invalidValue: 2, property: 'carrierServiceID' }];

            async.series([
                (cb) => {
                    fedexA1.carrierServiceID = false;

                    request(app)
                        .post("/shipments/fedex")
                        .send(fedexA1)
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

    it('does not allow the carrierServiceID to be unequal to either fedexAIR or fedexGround. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "someFedexService".', function (done) {
            var validation = [
                { message: 'Service type should be from the following list: fedexAIR,fedexGround.', invalidValue: "someFedexService", property: 'carrierServiceID' }];

            async.series([
                (cb) => {
                    fedexA1.carrierServiceID = "someFedexService";

                    request(app)
                        .post("/shipments/fedex")
                        .send(fedexA1)
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

    it('does not allow the carrierServiceID to be unequal to either fedexAIR or fedexGround. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "UPSExpress".', function (done) {
            var validation = [
                { message: 'Service type should be from the following list: fedexAIR,fedexGround.', invalidValue: "UPSExpress", property: 'carrierServiceID' }];

            async.series([
                (cb) => {
                    fedexA1.carrierServiceID = "UPSExpress";

                    request(app)
                        .post("/shipments/fedex")
                        .send(fedexA1)
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
