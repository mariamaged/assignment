var Joi = require('joi');
var mustache = require('mustache');
let allowedServices = ['fedex', 'ups'];

class ShipmentError {
    static serviceTemplate = "Service type should be from the following list: {{list}}.";
    static detailsTemplate = "{{quantity}} unit should be equal to {{unit}}.";
    static dataTypeTemplate = "Data type invalid: should be {{datatype}}.";
    static invalidServiceTemplate = "You can not {{httpverb}} shipments with this service ID in the {{location}}. Service ID should be one of the following: [{{services}}].";
    static incorrectNumberRange = "Number out of range. Value should be {{inorexLeft}} {{first}}, {{second}} {{inorexRight}}.";
    /* 
    Aggregate all error messages of missing fields into one array.
    And all validation error messages into one array. 
    [All validation error message related to a single property are compiled together.]
    Return an object consisting of these arrays.
    Override for each service adding to the object the name of the service.
    **/
    updateErrorMessages(errorsArray) {
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
}

class FedexShipmentError extends ShipmentError {
    propertyNames = { serviceType: "carrierServiceID", packageInfo: "packageDetails" };
    #data;

    constructor(data) {
        super();
        this.#data = data;
        this.schema = Joi.object().keys({
            carrierServiceID: Joi.string().valid(...data.serviceTypeList).required().messages({
                'string.base': mustache.render(FedexShipmentError.dataTypeTemplate, { datatype: "String" }),
                'any.only': mustache.render(FedexShipmentError.serviceTemplate, { list: data.serviceTypeList })
            }),
            packageDetails: Joi.object().keys(
                {
                    width: Joi.object().keys({
                        value: Joi.number().greater(0).required().messages({
                            'number.base': mustache.render(FedexShipmentError.dataTypeTemplate, { datatype: "Numeric" }),
                            'number.greater': mustache.render(FedexShipmentError.incorrectNumberRange, { inorexLeft: "(", first: "0", second: " ", inorexRight: ")" })
                        }),
                        unit: Joi.string().valid(data.widthUnit).required().messages({
                            'string.base': mustache.render(FedexShipmentError.dataTypeTemplate, { datatype: "String" }),
                            'any.only': mustache.render(FedexShipmentError.detailsTemplate, { quantity: "Width", unit: data.widthUnit })
                        })
                    }).required(),

                    height: Joi.object().keys({
                        value: Joi.number().greater(0).required().messages({
                            'number.base': mustache.render(FedexShipmentError.dataTypeTemplate, { datatype: "Numeric" }),
                            'number.greater': mustache.render(FedexShipmentError.incorrectNumberRange, { inorexLeft: "(", first: "0", second: " ", inorexRight: ")" })
                        }),
                        unit: Joi.string().valid(data.heightUnit).required().messages({
                            'string.base': mustache.render(FedexShipmentError.dataTypeTemplate, { datatype: "String" }),
                            'any.only': mustache.render(FedexShipmentError.detailsTemplate, { quantity: "Height", unit: data.heightUnit })
                        })
                    }).required(),

                    length: Joi.object().keys({
                        value: Joi.number().greater(0).required().messages({
                            'number.base': mustache.render(FedexShipmentError.dataTypeTemplate, { datatype: "Numeric" }),
                            'number.greater': mustache.render(FedexShipmentError.incorrectNumberRange, { inorexLeft: "(", first: "0", second: " ", inorexRight: ")" })
                        }),
                        unit: Joi.string().valid(data.lengthUnit).required().messages({
                            'string.base': mustache.render(FedexShipmentError.dataTypeTemplate, { datatype: "String" }),
                            'any.only': mustache.render(FedexShipmentError.detailsTemplate, { quantity: "Length", unit: data.lengthUnit })
                        })
                    }).required(),

                    weight: Joi.object().keys({
                        value: Joi.number().greater(0).required().messages({
                            'number.base': mustache.render(FedexShipmentError.dataTypeTemplate, { datatype: "Numeric" }),
                            'number.greater': mustache.render(FedexShipmentError.incorrectNumberRange, { inorexLeft: "(", first: "0", second: " ", inorexRight: ")" })
                        }),
                        unit: Joi.string().valid(data.weightUnit).required().messages({
                            'string.base': mustache.render(FedexShipmentError.dataTypeTemplate, { datatype: "String" }),
                            'any.only': mustache.render(FedexShipmentError.detailsTemplate, { quantity: "Weight", unit: data.weightUnit })
                        })
                    }).required()
                }
            ).required()
        });
    }

    updateErrorMessages(errorArray) {
        const errorObject = super.updateErrorMessages(errorArray);
        errorObject.serviceID = 'fedex';
        return errorObject;
    }
}

class UPSShipmentError extends ShipmentError {
    propertyNames = { serviceType: "shipmentServiceID", packageInfo: "package" };
    #data;

    constructor(data) {
        super();
        this.data = data;
        this.schema = Joi.object().keys({
            shipmentServiceID: Joi.string().valid(...data.serviceTypeList).required().messages({
                'string.base': mustache.render(UPSShipmentError.dataTypeTemplate, { datatype: "String" }),
                'any.only': mustache.render(UPSShipmentError.serviceTemplate, { list: data.serviceTypeList })
            }),
            package: Joi.object().keys(
                {
                    width: Joi.object().keys({
                        value: Joi.number().greater(0).required().messages({
                            'number.base': mustache.render(UPSShipmentError.dataTypeTemplate, { datatype: "Numeric" }),
                            'number.greater': mustache.render(UPSShipmentError.incorrectNumberRange, { inorexLeft: "(", first: "0", second: " ", inorexRight: ")" })
                        }),
                        unit: Joi.string().valid(data.widthUnit).required().messages({
                            'string.base': mustache.render(UPSShipmentError.dataTypeTemplate, { datatype: "String" }),
                            'any.only': mustache.render(UPSShipmentError.detailsTemplate, { quantity: "Width", unit: data.widthUnit })
                        })
                    }).required(),

                    height: Joi.object().keys({
                        value: Joi.number().greater(0).required().messages({
                            'number.base': mustache.render(UPSShipmentError.dataTypeTemplate, { datatype: "Numeric" }),
                            'number.greater': mustache.render(UPSShipmentError.incorrectNumberRange, { inorexLeft: "(", first: "0", second: " ", inorexRight: ")" })
                        }),
                        unit: Joi.string().valid(data.heightUnit).required().messages({
                            'string.base': mustache.render(UPSShipmentError.dataTypeTemplate, { datatype: "String" }),
                            'any.only': mustache.render(UPSShipmentError.detailsTemplate, { quantity: "Height", unit: data.heightUnit })
                        })
                    }).required(),

                    length: Joi.object().keys({
                        value: Joi.number().greater(0).required().messages({
                            'number.base': mustache.render(UPSShipmentError.dataTypeTemplate, { datatype: "Numeric" }),
                            'number.greater': mustache.render(UPSShipmentError.incorrectNumberRange, { inorexLeft: "(", first: "0", second: " ", inorexRight: ")" })
                        }),
                        unit: Joi.string().valid(data.lengthUnit).required().messages({
                            'string.base': mustache.render(UPSShipmentError.dataTypeTemplate, { datatype: "String" }),
                            'any.only': mustache.render(UPSShipmentError.detailsTemplate, { quantity: "Length", unit: data.lengthUnit })
                        })
                    }).required(),

                    weight: Joi.object().keys({
                        value: Joi.number().greater(0).required().messages({
                            'number.base': mustache.render(UPSShipmentError.dataTypeTemplate, { datatype: "Numeric" }),
                            'number.greater': mustache.render(UPSShipmentError.incorrectNumberRange, { inorexLeft: "(", first: "0", second: " ", inorexRight: ")" })
                        }),
                        unit: Joi.string().valid(data.weightUnit).required().messages({
                            'string.base': mustache.render(UPSShipmentError.dataTypeTemplate, { datatype: "String" }),
                            'any.only': mustache.render(UPSShipmentError.detailsTemplate, { quantity: "Weight", unit: data.weightUnit })
                        })
                    }).required()
                }
            ).required()
        });
    }

    updateErrorMessages(errorArray) {
        const errorObject = super.updateErrorMessages(errorArray);
        errorObject.serviceID = 'ups';
        return errorObject;
    }
}
class ErrorFactory {
    static createError(data) {
        if (data.endpoint.startsWith('POST-/shipments')) {
            switch (data.serviceID) {
                case 'fedex': return new FedexShipmentError({
                    serviceTypeList: ['fedexAIR', 'fedexGround'],
                    widthUnit: "cm",
                    lengthUnit: "cm",
                    heightUnit: "cm",
                    weightUnit: "gram"
                });;
                case 'ups': return new UPSShipmentError({
                    serviceTypeList: ['UPSExpress', 'UPS2DAY'],
                    widthUnit: "inch",
                    lengthUnit: "inch",
                    heightUnit: "inch",
                    weightUnit: "pound"
                });
                default: return mustache.render(ShipmentError.invalidServiceTemplate,
                    { httpverb: 'POST', location: 'request.params', services: allowedServices });
            }
        }
        if (data.endpoint.startsWith('GET-/shipments')) {
            return mustache.render(ShipmentError.invalidServiceTemplate,
                { httpverb: 'GET', location: 'request.query', services: allowedServices });
        }
        if (data.endpoint.startsWith('DELETE-/shipments')) {
            return mustache.render(ShipmentError.invalidServiceTemplate,
                { httpverb: 'DELETE', location: 'request.query', services: allowedServices });
        }
    }
}


module.exports = {
    ErrorFactory,
    allowedServices
};