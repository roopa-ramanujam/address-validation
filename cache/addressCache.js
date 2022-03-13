import Address from "../models/Address.js";
import { routeMapping, stateMapping } from "../routeMapping.js";

const cacheLookup = async (address) => {
  const addressLineOne = standardizeForLookup(
    address.addressLineOne,
    routeMapping
  );
  const state = standardizeForLookup(address.state, stateMapping);
  const result = await Address.findOne({
    addressLineOne: addressLineOne,
    city: address.city,
    state: state,
    zipCode: address.zipCode,
  });
  return result;
};

const cacheInsert = async (address) => {
  const addressToSave = new Address(address);
  const result = await addressToSave.save();
  return result;
};

const standardizeForLookup = (addressComponent, mapping) => {
  let component = addressComponent;
  Object.keys(mapping).filter((key) => {
    if (component.includes(key)) {
      component = component.replace(key, mapping[key]);
    }
  });
  return component;
};

export { cacheLookup, cacheInsert };
