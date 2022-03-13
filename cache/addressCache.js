import Address from "../models/Address.js";

const cacheLookup = async (address) => {
  const result = await Address.findOne({
    addressLineOne: address.addressLineOne,
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

export { cacheLookup, cacheInsert };
