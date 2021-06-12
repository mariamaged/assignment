var { upsDay, upsExpress } = require('./POSTShipment.js');
var request = require('supertest');
var app = require("../app.js");
var async = require('async');
var { clone, compareEquality } = require('../utils/objectUtilities.js');

var upsExpress1, upsDay1;
describe('UPS height data validations', function () {
    beforeEach(function () {
        upsDay1 = (function () { return clone(upsDay); })();
        upsExpress1 = (function () { return clone(upsExpress); })();
    });

    it('detects the absence of unit property.', function (done) {
        var validation = [
            { message: '"package.height.unit" is required', property: 'package.height.unit' }];

        async.series([
            (cb) => {
                delete upsDay1.package.height.unit;

                request(app)
                    .post("/shipments/ups")
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
                    .end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                delete upsExpress1.package.height.unit;

                request(app)
                    .post('/shipments/ups')
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

    it('detects the absence of value property.', function (done) {
        var validation = [
            { message: '"package.height.value" is required', property: 'package.height.value' }];

        async.series([
            (cb) => {
                delete upsDay1.package.height.value;

                request(app)
                    .post("/shipments/ups")
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
                    .end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                delete upsExpress1.package.height.value;

                request(app)
                    .post('/shipments/ups')
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

    it('detects the absence of height property.', function (done) {
        var validation = [
            { message: '"package.height" is required', property: 'package.height' }];

        async.series([
            (cb) => {
                delete upsDay1.package.height;

                request(app)
                    .post("/shipments/ups")
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
                    .end((err, res) => { if (err) throw err }); cb(null);
            },
            (cb) => {
                delete upsExpress1.package.height;

                request(app)
                    .post('/shipments/ups')
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

    it('does not allow the unit to be non string and unequal to inch. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value 2.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: 2, property: 'package.height.unit' },
                { message: 'Height unit should be equal to inch.', invalidValue: 2, property: 'package.height.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.unit = 2;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.unit = 2;

                    request(app)
                        .post('/shipments/ups')
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

    it('does not allow the unit to be non string and unequal to inch. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value null.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: null, property: 'package.height.unit' },
                { message: 'Height unit should be equal to inch.', invalidValue: null, property: 'package.height.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.unit = null;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.unit = null;

                    request(app)
                        .post('/shipments/ups')
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

    it('does not allow the unit to be non string and unequal to inch. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value false.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: false, property: 'package.height.unit' },
                { message: 'Height unit should be equal to inch.', invalidValue: false, property: 'package.height.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.unit = false;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.unit = false;

                    request(app)
                        .post('/shipments/ups')
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

    it('does not allow the unit to be unequal to inch. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "someString".', function (done) {
            var validation = [
                { message: 'Height unit should be equal to inch.', invalidValue: "someString", property: 'package.height.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.unit = "someString";

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.unit = "someString";

                    request(app)
                        .post('/shipments/ups')
                        .send(upsExpress1)
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

    it('does not allow the unit to be unequal to inch. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "cm".', function (done) {
            var validation = [
                { message: 'Height unit should be equal to inch.', invalidValue: "cm", property: 'package.height.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.unit = "cm";

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.unit = "cm";

                    request(app)
                        .post('/shipments/ups')
                        .send(upsExpress1)
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
                { message: 'Number out of range. Value should be ( 0,   ).', invalidValue: -1, property: 'package.height.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.value = -1;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.value = -1;
                    request(app)
                        .post('/shipments/ups')
                        .send(upsExpress1)
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
                { message: 'Number out of range. Value should be ( 0,   ).', invalidValue: 0, property: 'package.height.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.value = 0;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.value = 0;
                    request(app)
                        .post('/shipments/ups')
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

    it('does not allow the value to be a non-number value. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "someString".', function (done) {
            var validation = [
                { message: 'Data type invalid: should be Numeric.', invalidValue: "someString", property: 'package.height.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.value = "someString";

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.value = "someString";
                    request(app)
                        .post('/shipments/ups')
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

    it('does not allow the value to be a non-number value. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value null.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be Numeric.', invalidValue: null, property: 'package.height.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.value = null;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.value = null;
                    request(app)
                        .post('/shipments/ups')
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

    it('does not allow the value to be a non-number value. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value false.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be Numeric.', invalidValue: false, property: 'package.height.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.height.value = false;

                    request(app)
                        .post("/shipments/ups")
                        .send(upsDay1)
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
                    upsExpress1.package.height.value = false;
                    request(app)
                        .post('/shipments/ups')
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


