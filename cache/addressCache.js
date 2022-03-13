import Address from "../models/Address.js";
import { routeMapping } from "../routeMapping.js";

const cacheLookup = async (address) => {
  const addressLineOne = standardizeRouteForLookup(address.addressLineOne);
  const result = await Address.findOne({
    addressLineOne: addressLineOne,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
  });
  return result;
};

const cacheInsert = async (address) => {
  const addressToSave = new Address(address);
  const result = await addressToSave.save();
  return result;
};

const standardizeRouteForLookup = (addressLineOne) => {
  let streetAddress = addressLineOne;
  Object.keys(routeMapping).filter((key) => {
    if (streetAddress.includes(key)) {
      streetAddress = streetAddress.replace(key, routeMapping[key]);
    }
  })
  return streetAddress;
}

export { cacheLookup, cacheInsert };
