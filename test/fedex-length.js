var { fedexG, fedexA } = require('./POSTShipment.js');
var request = require('supertest');
var app = require("../app.js");
var async = require('async');
var { clone, compareEquality } = require('../utils/objectUtilities.js');

var fedexG1, fedexA1;

describe('Fedex length data validations', function () {
    // After each test changing a small attribute of the correct body, reassign a fresh copy of the body to the variables again.
    beforeEach(function () {
        fedexA1 = (function () { return clone(fedexA); })();
        fedexG1 = (function () { return clone(fedexG); })();
    });

    it('detects the absence of unit property.', function (done) {
        var validation = [
            { message: '"packageDetails.length.unit" is required', property: 'packageDetails.length.unit' }];

        async.series([
            (cb) => {
                delete fedexA1.packageDetails.length.unit;

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
                delete fedexG1.packageDetails.length.unit;

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

    it('detects the absence of value property.', function (done) {
        var validation = [
            { message: '"packageDetails.length.value" is required', property: 'packageDetails.length.value' }];

        async.series([
            (cb) => {
                delete fedexA1.packageDetails.length.value;

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
                delete fedexG1.packageDetails.length.value;

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

    it('detects the absence of length property.', function (done) {
        var validation = [
            { message: '"packageDetails.length" is required', property: 'packageDetails.length' }];

        async.series([
            (cb) => {
                delete fedexA1.packageDetails.length;

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
                delete fedexG1.packageDetails.length;

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

    it('does not allow the unit to be non string and unequal to cm. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value 2.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: 2, property: 'packageDetails.length.unit' },
                { message: 'Length unit should be equal to cm.', invalidValue: 2, property: 'packageDetails.length.unit' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.unit = 2;

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
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.unit = 2;

                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
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

    it('does not allow the unit to be non string and unequal to cm. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value null.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: null, property: 'packageDetails.length.unit' },
                { message: 'Length unit should be equal to cm.', invalidValue: null, property: 'packageDetails.length.unit' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.unit = null;

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
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.unit = null;

                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
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

    it('does not allow the unit to be non string and unequal to cm. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value false.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: false, property: 'packageDetails.length.unit' },
                { message: 'Length unit should be equal to cm.', invalidValue: false, property: 'packageDetails.length.unit' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.unit = false;

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
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.unit = false;

                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
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

    it('does not allow the unit to be unequal to cm. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "someString".', function (done) {
            var validation = [
                { message: 'Length unit should be equal to cm.', invalidValue: "someString", property: 'packageDetails.length.unit' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.unit = "someString";

                    request(app)
                        .post("/shipments/fedex")
                        .send(fedexA1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1 &&
                                (compareEquality(err[0], validation[0], true))))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.unit = "someString";

                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1 &&
                                (compareEquality(err[0], validation[0], true))))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb();
                }
            ], done);
        });

    it('does not allow the unit to be unequal to cm. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "inch".', function (done) {
            var validation = [
                { message: 'Length unit should be equal to cm.', invalidValue: "inch", property: 'packageDetails.length.unit' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.unit = "inch";

                    request(app)
                        .post("/shipments/fedex")
                        .send(fedexA1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1 &&
                                (compareEquality(err[0], validation[0], true))))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.unit = "inch";

                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1 &&
                                (compareEquality(err[0], validation[0], true))))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb();
                }
            ], done);
        });

    it('does not allow the value to be smaller than 0. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value -1.', function (done) {
            var validation = [
                { message: 'Number out of range. Value should be ( 0,   ).', invalidValue: -1, property: 'packageDetails.length.value' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.value = -1;

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
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.value = -1;
                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
                        .expect(400)
                        .expect("Content-Type", /application\/json/)
                        .expect(function (res) {
                            var err = res.body.validationErrors;
                            if (!(err.length === 1
                                && (compareEquality(err[0], validation[0], true))))
                                throw new Error('Response body not correct.');
                        })
                        .end((err, res) => { if (err) throw err }); cb(null);
                }], done);
        });
    it('does not allow the value to be smaller than 0. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value 0.', function (done) {
            var validation = [
                { message: 'Number out of range. Value should be ( 0,   ).', invalidValue: 0, property: 'packageDetails.length.value' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.value = 0;

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
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.value = 0;
                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
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

    it('does not allow the value to be a non-number value. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "someString".', function (done) {
            var validation = [
                { message: 'Data type invalid: should be Numeric.', invalidValue: "someString", property: 'packageDetails.length.value' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.value = "someString";

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
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.value = "someString";
                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
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

    it('does not allow the value to be a non-number value. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value null.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be Numeric.', invalidValue: null, property: 'packageDetails.length.value' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.value = null;

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
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.value = null;
                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
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

    it('does not allow the value to be a non-number value. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value false.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be Numeric.', invalidValue: false, property: 'packageDetails.length.value' }];
            async.series([
                (cb) => {
                    fedexA1.packageDetails.length.value = false;

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
                        .end((err, res) => { if (err) throw err }); cb(null);
                },
                (cb) => {
                    fedexG1.packageDetails.length.value = false;
                    request(app)
                        .post('/shipments/fedex')
                        .send(fedexG1)
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


