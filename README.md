Bulk Address Validation

Standalone API endpoint to validate a list of up to 5 addresses using the Google Maps Geocoding API. Send a POST request to /addressValidations in the following request format:

Array of JSON object addresses with the keys "address_line_one", "city", "state", "zip_code". All keys are required for address validation.
Example

[
{
"address_line_one": "1 World Trade Center",
"city": "New York",
"state": "NY",
"zip_code": "10007"
},
...
]

Response:
HTTP 207 Multi-part response with the status and response body for each address in the request.

Example:

[
{
"status": 200,
"body": {
"address_line_one": "1 World Trade Center",
"city": "New York",
"state": "NY",
"zip": "10007",
"latitude": 40.7133024,
"longitude": -74.0117408
}
},
{
"status": 400,
"body": {
"error": "Invalid request"
}
},
{
"status": 404,
"body": {
"error": "Address not found"
}
}
]
