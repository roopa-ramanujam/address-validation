import { findBestMatch } from "string-similarity";
import { Client } from "@googlemaps/google-maps-services-js";
import { fieldExists } from "../../utils.js";

const isAddressRequestValid = (address) => {
  return (
    fieldExists(address, "address_line_one") &&
    fieldExists(address, "city") &&
    fieldExists(address, "state") &&
    fieldExists(address, "zip_code")
  );
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
        const validatedAddress = constructValidatedAddress(
          address,
          gcResponse.data.results[0]
        );
        return validatedAddress;
      } else {
        return {};
      }
    })
    .catch((e) => {
      console.log(e);
    });
  return validatedAddress;
};

const constructValidatedAddress = (inputAddress, results) => {
  const addressComponents = results.address_components;
  const formattedAddressArr = results.formatted_address.split(", ");
  const validatedStreetAddress = findMostSimilarAddressComponent(
    formattedAddressArr,
    inputAddress.address_line_one
  );
  const validatedCity = findMostSimilarAddressComponent(
    formattedAddressArr,
    inputAddress.city
  );
  const validatedState = findAddressComponent(
    addressComponents,
    "administrative_area_level_1"
  );
  const validatedZip = findAddressComponent(addressComponents, "postal_code");
  const latitude = results.geometry.location.lat;
  const longitude = results.geometry.location.lng;
  return {
    address_line_one: validatedStreetAddress,
    city: validatedCity,
    state: validatedState,
    zip_code: validatedZip,
    latitude,
    longitude,
  };
};

const findMostSimilarAddressComponent = (
  addressComponentsArray,
  addressComponentString
) => {
  const matches = findBestMatch(addressComponentString, addressComponentsArray);
  return matches.bestMatch.target;
};

const findAddressComponent = (addressComponents, targetString) => {
  let addressField = "";
  addressComponents.forEach((component) => {
    if (component.types.includes(targetString)) {
      addressField = component.short_name;
      return;
    }
  });
  return addressField;
};

export { validateAddress, isAddressRequestValid };
