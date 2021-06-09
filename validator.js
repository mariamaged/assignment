var mustache = require('mustache');
var Joi = require('joi');

const serviceTemplate = "{{service}} should be from the following list: {{list}}";
const detailsTemplate = "{{quantity}} unit should be equal to {{unit}}";
const dataTypeTemplate = "Data type invalid: should be {{datatype}}";

const fedex = {
    serviceTypeList: ['fedexAIR', 'fedexGround'],
    "widthUnit": "cm",
    "lengthUnit": "cm",
    "heightUnit": "cm",
    "weightUnit": "gram"
},
    fedexSchema = Joi.object().keys({
        carrierServiceID: Joi.string().valid(...fedex.serviceTypeList).required().messages({
            'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
            'any.only': mustache.render(serviceTemplate, { service: fedex.serviceTypeFormatted, list: fedex.serviceTypeList })
        }),
        packageDetails: Joi.object().keys(
            {
                width: Joi.object().keys({
                    value: Joi.number().required().messages({
                        'number.base': mustache.render(dataTypeTemplate, { datatype: "Numeric" })
                    }),
                    unit: Joi.string().valid(fedex.widthUnit).required().messages({
                        'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
                        'any.only': mustache.render(detailsTemplate, { quantity: "Width", unit: fedex.widthUnit })
                    })
                }).required(),

                height: Joi.object().keys({
                    value: Joi.number().required().messages({
                        'number.base': mustache.render(dataTypeTemplate, { datatype: "Numeric" })
                    }),
                    unit: Joi.string().valid(fedex.heightUnit).required().messages({
                        'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
                        'any.only': mustache.render(detailsTemplate, { quantity: "Height", unit: fedex.heightUnit })
                    })
                }).required(),

                length: Joi.object().keys({
                    value: Joi.number().required().messages({
                        'number.base': mustache.render(dataTypeTemplate, { datatype: "Numeric" })
                    }),
                    unit: Joi.string().valid(fedex.heightUnit).required().messages({
                        'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
                        'any.only': mustache.render(detailsTemplate, { quantity: "Length", unit: fedex.lengthUnit })
                    })
                }).required(),

                weight: Joi.object().keys({
                    value: Joi.number().required().messages({
                        'number.base': mustache.render(dataTypeTemplate, { datatype: "Numeric" })
                    }),
                    unit: Joi.string().valid(fedex.weightUnit).required().messages({
                        'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
                        'any.only': mustache.render(detailsTemplate, { quantity: "Weight", unit: fedex.weightUnit })
                    })
                }).required()
            }
        ).required()
    })

const ups = {
    serviceTypeList: ['UPSExpress', 'UPS2DAY'],
    "widthUnit": "inch",
    "lengthUnit": "inch",
    "heightUnit": "inch",
    "weightUnit": "pound"
},
    upsSchema = Joi.object().keys({
        shipmentServiceID: Joi.string().valid(...ups.serviceTypeList).required().messages({
            'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
            'any.only': mustache.render(serviceTemplate, { service: ups.serviceTypeFormatted, list: ups.serviceTypeList })
        }),
        package: Joi.object().keys(
            {
                width: Joi.object().keys({
                    value: Joi.number().required().messages({
                        'number.base': mustache.render(dataTypeTemplate, { datatype: "Numeric" })
                    }),
                    unit: Joi.string().valid(ups.widthUnit).required().messages({
                        'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
                        'any.only': mustache.render(detailsTemplate, { quantity: "Width", unit: ups.widthUnit })
                    })
                }).required(),

                height: Joi.object().keys({
                    value: Joi.number().required().messages({
                        'number.base': mustache.render(dataTypeTemplate, { datatype: "Numeric" })
                    }),
                    unit: Joi.string().valid(ups.heightUnit).required().messages({
                        'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
                        'any.only': mustache.render(detailsTemplate, { quantity: "Height", unit: ups.heightUnit })
                    })
                }).required(),

                length: Joi.object().keys({
                    value: Joi.number().required().messages({
                        'number.base': mustache.render(dataTypeTemplate, { datatype: "Numeric" })
                    }),
                    unit: Joi.string().valid(ups.heightUnit).required().messages({
                        'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
                        'any.only': mustache.render(detailsTemplate, { quantity: "Length", unit: ups.lengthUnit })
                    })
                }).required(),

                weight: Joi.object().keys({
                    value: Joi.number().required().messages({
                        'number.base': mustache.render(dataTypeTemplate, { datatype: "Numeric" })
                    }),
                    unit: Joi.string().valid(ups.weightUnit).required().messages({
                        'string.base': mustache.render(dataTypeTemplate, { datatype: "String" }),
                        'any.only': mustache.render(detailsTemplate, { quantity: "Weight", unit: ups.weightUnit })
                    })
                }).required()
            }
        ).required()
    })

function validationRules(serviceID) {
    // Empty validation middlewares array getting filled with 9 middleware.
    // 1. First middleware checks the Service Type (data type is string and belongs to the enum allowed).
    // 2. The following 4 middleware check width/height/length/weight units (data type is string and value is equal to the value allowed.)
    // 3. The following 4 middleware check width/height/length/weight value (data type is number).
    var validator = [];

    if (serviceID === 'fedex') serviceID = fedex;
    else serviceID = ups;

    validator.push(body(serviceID.serviceTypeProperty));
    validator.push(body(`${serviceID.packageInfoProperty}.width.unit`));
    validator.push(body(`${serviceID.packageInfoProperty}.height.unit`));
    validator.push(body(`${serviceID.packageInfoProperty}.length.unit`));
    validator.push(body(`${serviceID.packageInfoProperty}.weight.unit`));

    validator.map(function (v) { v.optional().isString().withMessage(mustache.render(dataTypeTemplate, { datatype: "String" })) });

    validator[0] = validator[0].isIn(serviceID.serviceTypeList)
        .withMessage(mustache.render(serviceTemplate, { service: serviceID.serviceTypeFormatted, list: serviceID.serviceTypeList }));
    validator[1] = validator[1].matches(serviceID.widthUnit)
        .withMessage(mustache.render(detailsTemplate, { quantity: "Width", unit: serviceID.widthUnit }))
    validator[2] = validator[2].matches(serviceID.heightUnit)
        .withMessage(mustache.render(detailsTemplate, { quantity: "Height", unit: serviceID.heightUnit }))
    validator[3] = validator[3].matches(serviceID.lengthUnit)
        .withMessage(mustache.render(detailsTemplate, { quantity: "Length", unit: serviceID.lengthUnit }))
    validator[4] = validator[4].matches(serviceID.weightUnit)
        .withMessage(mustache.render(detailsTemplate, { quantity: "Weight", unit: serviceID.weightUnit }))

    validator.push(body(`${serviceID.packageInfoProperty}.width.value`).optional().isNumeric().withMessage(mustache.render(dataTypeTemplate, { datatype: "Numeric" })));
    validator.push(body(`${serviceID.packageInfoProperty}.height.value`).optional().isNumeric().withMessage(mustache.render(dataTypeTemplate, { datatype: "Numeric" })));
    validator.push(body(`${serviceID.packageInfoProperty}.length.value`).optional().isNumeric().withMessage(mustache.render(dataTypeTemplate, { datatype: "Numeric" })));
    validator.push(body(`${serviceID.packageInfoProperty}.weight.value`).optional().isNumeric().withMessage(mustache.render(dataTypeTemplate, { datatype: "Numeric" })));

    return validator;
}


// Aggregate all error messages related to a property into an array of messages.
function updateErrorMessages(errorsArray) {
    var missingFieldsErrors = [], validationErrors = [];
    errorsArray.forEach((error) => {
        if (error.type === "any.required") missingFieldsErrors.push({ message: error.message, property: error.context.label });
        else {
            var found = false;
            for (var i = 0; i < validationErrors.length; i++) {
                if (validationErrors[i].property === error.context.label) {
                    found = true;
                    var oldMessages = validationErrors[i].message;
                    if (!Array.isArray(oldMessages)) {
                        validationErrors[i].message = [];
                        validationErrors[i].message.push(oldMessages); validationErrors[i].message.push(error.message);
                    }
                    else {
                        validationErrors[i].message.push(error.message);
                    }
                    break;
                }
            }
            if (!found) validationErrors.push({ invalidValue: error.context.value, message: error.message, property: error.context.label });
        }
    });

    return { missingFieldsErrors: missingFieldsErrors, validationErrors: validationErrors };
}
module.exports = {
    validationRules,
    fedexSchema,
    upsSchema,
    updateErrorMessages
};