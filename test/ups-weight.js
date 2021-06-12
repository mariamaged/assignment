var { upsDay, upsExpress } = require('./POSTShipment.js');
var request = require('supertest');
var app = require("../app.js");
var async = require('async');
var { clone, compareEquality } = require('../utils/objectUtilities.js');

var upsExpress1, upsDay1;
describe('UPS weight data validations', function () {
    beforeEach(function () {
        upsDay1 = (function () { return clone(upsDay); })();
        upsExpress1 = (function () { return clone(upsExpress); })();
    });

    it('detects the absence of unit property.', function (done) {
        var validation = [
            { message: '"package.weight.unit" is required', property: 'package.weight.unit' }];

        async.series([
            (cb) => {
                delete upsDay1.package.weight.unit;

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
                delete upsExpress1.package.weight.unit;

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
            { message: '"package.weight.value" is required', property: 'package.weight.value' }];

        async.series([
            (cb) => {
                delete upsDay1.package.weight.value;

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
                delete upsExpress1.package.weight.value;

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

    it('detects the absence of weight property.', function (done) {
        var validation = [
            { message: '"package.weight" is required', property: 'package.weight' }];

        async.series([
            (cb) => {
                delete upsDay1.package.weight;

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
                delete upsExpress1.package.weight;

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

    it('does not allow the unit to be non string and unequal to pound. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value 2.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: 2, property: 'package.weight.unit' },
                { message: 'Weight unit should be equal to pound.', invalidValue: 2, property: 'package.weight.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.unit = 2;

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
                    upsExpress1.package.weight.unit = 2;

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

    it('does not allow the unit to be non string and unequal to pound. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value null.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: null, property: 'package.weight.unit' },
                { message: 'Weight unit should be equal to pound.', invalidValue: null, property: 'package.weight.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.unit = null;

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
                    upsExpress1.package.weight.unit = null;

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

    it('does not allow the unit to be non string and unequal to pound. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value false.', function (done) {
            var validation = [
                { message: 'Data type invalid: should be String.', invalidValue: false, property: 'package.weight.unit' },
                { message: 'Weight unit should be equal to pound.', invalidValue: false, property: 'package.weight.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.unit = false;

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
                    upsExpress1.package.weight.unit = false;

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

    it('does not allow the unit to be unequal to pound. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "someString".', function (done) {
            var validation = [
                { message: 'Weight unit should be equal to pound.', invalidValue: "someString", property: 'package.weight.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.unit = "someString";

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
                    upsExpress1.package.weight.unit = "someString";

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

    it('does not allow the unit to be unequal to pound. ' +
        'Status code: 400. Content-Type: application/json. Correct Response Message for value "gram".', function (done) {
            var validation = [
                { message: 'Weight unit should be equal to pound.', invalidValue: "gram", property: 'package.weight.unit' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.unit = "gram";

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
                    upsExpress1.package.weight.unit = "gram";

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
                { message: 'Number out of range. Value should be ( 0,   ).', invalidValue: -1, property: 'package.weight.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.value = -1;

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
                    upsExpress1.package.weight.value = -1;
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
                { message: 'Number out of range. Value should be ( 0,   ).', invalidValue: 0, property: 'package.weight.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.value = 0;

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
                    upsExpress1.package.weight.value = 0;
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
                { message: 'Data type invalid: should be Numeric.', invalidValue: "someString", property: 'package.weight.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.value = "someString";

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
                    upsExpress1.package.weight.value = "someString";
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
                { message: 'Data type invalid: should be Numeric.', invalidValue: null, property: 'package.weight.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.value = null;

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
                    upsExpress1.package.weight.value = null;
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
                { message: 'Data type invalid: should be Numeric.', invalidValue: false, property: 'package.weight.value' }];
            async.series([
                (cb) => {
                    upsDay1.package.weight.value = false;

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
                    upsExpress1.package.weight.value = false;
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


