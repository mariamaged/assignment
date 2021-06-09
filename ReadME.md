# Internship - ZtarMobile
## API Endpoints
	1. Post a shipment to one of the following services: [fedex, ups]
- **Request Endpoint:** /shipments/:serviceID.
- **Method/HTTP Verb:** POST.
- **Request Content-Type:** application/json.
- **Request parameter error:** If the serviceID value is not equal to either [fedex, ups], the response sends back a message `Service IDs should be one of the following: fedex,ups` with status code `400`.
- **Request body for fedex:**

```json
{
	"carrierServiceID": "",
	"packageDetails": {
		"width": {
			"value": "",
			"unit": ""
		}
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
	"carrierServiceID": "",
	"packageDetails": {
		"width": {
			"value": "",
			"unit": ""
		}
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
   - **`packageDetails.width.value`** --> [Numeric].
   - **`packageDetails.width.unit`** --> [String, equal to [cm]].
   - **`packageDetails.height.value`** --> [Numeric].
   - **`packageDetails.height.unit`** --> [String, equal to [cm]].
   - **`packageDetails.length.value`** --> [Numeric].
   - **`packageDetails.length.unit`** --> [String, equal to [cm]].
   - **`packageDetails.weight.value`** --> [Numeric].
   - **`packageDetails.weight.unit`** --> [String, equal to [gram]].
- **Validation for ups:**
   - **`carrierServiceID`** --> [String, is in [UPSExpress, UPS2DAY]].
   - **`packageDetails.width.value`** --> [Numeric].
   - **`packageDetails.width.unit`** --> [String, equal to [inch]].
   - **`packageDetails.height.value`** --> [Numeric].
   - **`packageDetails.height.unit`** --> [String, equal to [inch]].
   - **`packageDetails.length.value`** --> [Numeric].
   - **`packageDetails.length.unit`** --> [String, equal to [inch]].
   - **`packageDetails.weight.value`** --> [Numeric].
   - **`packageDetails.weight.unit`** --> [String, equal to [pound]].
- **Validation response** --> status code: 400, response body:
```json
{
	"missingFieldsErrors": [],
	"validationErrors": []
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
    ]
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
- **Request parameter error:** If the user specified a serviceID and the value is not equal to either [fedex, ups], the response sends back a message `Service IDs should be one of the following: fedex,ups` with status code `400`.
- **Response body (status code 200 with either shipments if there are any or empty response body if no shipments were found):**

```json
[
	{
	"serviceID" : "fedex",
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
	}
]
```