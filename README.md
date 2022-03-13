# Bulk Address Validation

- Hosted at https://address-validation-api.herokuapp.com/addressValidations

## Features

- POST endpoint that accepts up to 5 addresses in a JSON array format to receive validated address and latitude/longitude coordinates
- Caching mechanism for frequently looked up addresses

## Request

Array of JSON object addresses with the keys "address_line_one", "city", "state", "zip_code". All keys are required for address validation.

```json
[
    {
        "address_line_one": "1 World Trade Center",
        "city": "New York",
        "state": "NY",
        "zip_code": "10007"
    },
...
]
```

## Response

HTTP 207 Multi-part response with the status and response body for each address in the request.

```json
[
  {
    "status": 200,
    "body": {
      "address_line_one": "1 WORLD TRADE CENTER",
      "city": "NEW YORK",
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
```

## Dependencies:

1. Google GeoCoding API for address validation and geolocation
2. MongoDB for cache
3. Mocha/Chai for unit testing

## Assumptions:

1. US-based addresses only
2. Max 5 entries in request
3. Returns valid address even if partial match according to geocoding API
4. Input address must match cache entry (validated address) closely to return cache hit

## Todo

1. Further preprocessing on request address to ensure that cache lookup would match despite differences in spelling or syntax. Basic mapping of most common standardizations for routes and states available for now.
2. Evict entries from cache after certain period of time
3. Additional unit tests
