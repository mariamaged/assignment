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

// Aggregate all error messages of missing fields into one array, and all validation error messages into one array. Return an object consisting of these arrays.
// All validation error message related to a single property are compiled together.
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
    fedexSchema,
    upsSchema,
    updateErrorMessages
};