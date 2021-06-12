# Internship - ZtarMobile
## API Endpoints
	1. Post a shipment to the allowed services.
- **Request Endpoint:** /shipments/:serviceID.
- **Method/HTTP Verb:** POST.
- **Request Content-Type:** application/json.
- **Request parameter error:** If the serviceID value is not equal to either [fedex, ups]\<allowed-services>, the response sends back a message `You can not POST shipments with this service ID in the request.params. Service ID should be one of the following:
[fedex,ups]<allowed-services>.` with status code `400`.
- **Request body for fedex:**

```json
{
	"carrierServiceID": "",
	"packageDetails": {
		"width": {
			"value": "",
			"unit": ""
		},
		"height": {
			"value": "",
			"unit": ""
		},
		"length": {
			"value": "",
			"unit": ""
		},
		"weight": {
			"value": "",
			"unit": ""
		}
	}
}
```
- **Request body for ups:**

```json
{
	"shipmentServiceID": "",
	"package": {
		"width": {
			"value": "",
			"unit": ""
		},
		"height": {
			"value": "",
			"unit": ""
		},
		"length": {
			"value": "",
			"unit": ""
		},
		"weight": {
			"value": "",
			"unit": ""
		}
	}
}
```
- **Validation for fedex:**
   - **`carrierServiceID`** --> [String, is in [fedexGround, fedexAIR].
   - **`packageDetails.width.value`** --> [Numeric, greater than [0]].
   - **`packageDetails.width.unit`** --> [String, equal to [cm]].
   - **`packageDetails.height.value`** --> [Numeric, greater than [0]].
   - **`packageDetails.height.unit`** --> [String, equal to [cm]].
   - **`packageDetails.length.value`** --> [Numeric, greater than [0]].
   - **`packageDetails.length.unit`** --> [String, equal to [cm]].
   - **`packageDetails.weight.value`** --> [Numeric, greater than [0]].
   - **`packageDetails.weight.unit`** --> [String, equal to [gram]].
- **Validation for ups:**
   - **`shipmentServiceID`** --> [String, is in [UPSExpress, UPS2DAY]].
   - **`package.width.value`** --> [Numeric, greater than [0]].
   - **`package.width.unit`** --> [String, equal to [inch]].
   - **`package.height.value`** --> [Numeric, greater than [0]].
   - **`package.height.unit`** --> [String, equal to [inch]].
   - **`package.length.value`** --> [Numeric, greater than [0]].
   - **`package.length.unit`** --> [String, equal to [inch]].
   - **`package.weight.value`** --> [Numeric, greater than [0]].
   - **`package.weight.unit`** --> [String, equal to [pound]].
- **Validation response** --> status code: 400, response body:
```json
{
	"missingFieldsErrors": [],
	"validationErrors": [],
	"serviceID": ""
}
```
- **Example validation response body:**
```json
{
    "missingFieldsErrors": [
        {
            "message": "\"carrierServiceID\" is required",
            "property": "carrierServiceID"
        }
    ],
    "validationErrors": [
        {
            "invalidValue": 2,
            "message": [
                "Height unit should be equal to cm",
                "Data type invalid: should be String"
            ],
            "property": "packageDetails.height.unit"
        },
        {
            "invalidValue": "five",
            "message": "Data type invalid: should be Numeric",
            "property": "packageDetails.weight.value"
        },
        {
            "invalidValue": "pound",
            "message": "Weight unit should be equal to gram",
            "property": "packageDetails.weight.unit"
        }
    ],
    "serviceID": "fedex"
}
```
- **Success response** --> status code: 200, response body:
```json
Shipment to <serviceID> completed successfully!
```
***
	2. Retrieve shipment done to a particular service or all services.
- **Request Endpoint:** /shipments.
- **Method/HTTP Verb:** GET.
- **Request optional query:** ?serviceID=\<serviceID>.
- **Request query error:** If the user specified a serviceID and the value is not equal to either [fedex, ups]\<allowed-services>, the response sends back a message `You can not GET shipments with this service ID in the request.query. Service ID should be one of the following:[fedex,ups]<allowed-services>.` with status code `400`.
- **Response body for a particular service shipments (status code 200 with either shipments if there are any or empty response body if no shipments were found):**

```json
[
	{
	"serviceType": "fedexGround",
	"widthUnit": "cm",
	"widthValue": 3,
	"heightUnit": "cm",
	"heightValue": 2,
	"lengthUnit": "cm",
	"lengthValue": 2,
	"weightUnit": "gram",
	"weightValue": 5,
	"createdAt": "2021-06-09T15:13:23.318Z",	
	"updatedAt": "2021-06-09T15:13:23.318Z"
	},

	{
	"serviceType": "fedexGround",
	"widthUnit": "cm",
	"widthValue": 3,
	"heightUnit": "cm",
	"heightValue": 2,
	"lengthUnit": "cm",
	"lengthValue": 2,
	"weightUnit": "gram",
	"weightValue": 5,
	"createdAt": "2021-06-09T15:14:12.926Z",
	"updatedAt": "2021-06-09T15:14:12.926Z"
	}
]
```
- **Response body for all services (status code 200 with either shipments if there are any [each shipment object has the serviceID attached to it] or empty response body if no shipments were found):**

```javascript
[
    {
        "serviceID": "fedex",
        "serviceType": "fedexGround",
        "widthUnit": "cm",
        "widthValue": 3,
        "heightUnit": "cm",
        "heightValue": 2,
        "lengthUnit": "cm",
        "lengthValue": 2,
        "weightUnit": "gram",
        "weightValue": 5,
        "createdAt": "2021-06-09T15:13:23.318Z",
        "updatedAt": "2021-06-09T15:13:23.318Z"
    },
    {
        "serviceID": "fedex",
        "serviceType": "fedexGround",
        "widthUnit": "cm",
        "widthValue": 3,
        "heightUnit": "cm",
        "heightValue": 2,
        "lengthUnit": "cm",
        "lengthValue": 2,
        "weightUnit": "gram",
        "weightValue": 5,
        "createdAt": "2021-06-09T15:14:12.926Z",
        "updatedAt": "2021-06-09T15:14:12.926Z"
    },
    {
        "serviceID": "ups",
        "serviceType": "UPSExpress",
        "widthUnit": "inch",
        "widthValue": 3,
        "heightUnit": "inch",
        "heightValue": 2,
        "lengthUnit": "inch",
        "lengthValue": 2,
        "weightUnit": "pound",
        "weightValue": 5,
        "createdAt": "2021-06-09T16:06:39.056Z",
        "updatedAt": "2021-06-09T16:06:39.056Z"
    }
]
```
***
	2. Delete shipment done to a particular service or all services.
- **Request Endpoint:** /shipments.
- **Method/HTTP Verb:** DELETE.
- **Request optional query:** ?serviceID=\<serviceID>.
- **Request query error:** If the user specified a serviceID and the value is not equal to either [fedex, ups]\<allowed-services>, the response sends back a message `You can not DELETE shipments with this service ID in the request.query. Service ID should be one of the following:[fedex,ups]<allowed-services>.` with status code `400`.
- **Response status code:** 204.