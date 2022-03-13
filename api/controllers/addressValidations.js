import { Client } from "@googlemaps/google-maps-services-js";

const isRequestValid = (address) => {
  return (
    fieldExists(address, "address_line_one") &&
    fieldExists(address, "city") &&
    fieldExists(address, "state") &&
    fieldExists(address, "zip_code")
  );
};

const fieldExists = (obj, key) => {
  return key in obj;
};

const validateAddress = async (address) => {
  const args = {
    params: {
      key: process.env.GOOGLE_API_KEY,
      address:
        address.address_line_one +
        " " +
        address.city +
        " " +
        address.state +
        " " +
        address.zip_code,
    },
  };
  const client = new Client();
  const validatedAddress = await client
    .geocode(args)
    .then((gcResponse) => {
      if (gcResponse.data.results.length > 0) {
        return constructValidatedAddress(gcResponse.data.results);
      } else {
        return {};
      }
    })
    .catch((e) => {
      console.log(e);
    });
  return validatedAddress;
};

const constructValidatedAddress = (results) => {
  const formattedAddress = results[0].formatted_address;
  const formattedAddressArr = formattedAddress.split(", ");
  const formattedStreetAddress = formattedAddressArr[0];
  const formattedCity = formattedAddressArr[1];
  const formattedState = formattedAddressArr[2].split(" ")[0];
  const formattedZip = formattedAddressArr[2].split(" ")[1];
  const latitude = results[0].geometry.location.lat;
  const longitude = results[0].geometry.location.lng;
  return {
    address_line_one: formattedStreetAddress,
    city: formattedCity,
    state: formattedState,
    zip_code: formattedZip,
    latitude,
    longitude,
  };
};

export { validateAddress, isRequestValid };
