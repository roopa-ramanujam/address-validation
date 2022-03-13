import Address from "../models/Address.js";

const cacheLookup = async (address) => {
  const result = await Address.findOne({
    address_line_one: address.address_line_one,
    city: address.city,
    state: address.state,
    zip_code: address.zip_code,
  });
  return result;
};

const cacheInsert = async (address) => {
  const addressToSave = new Address({
    address_line_one: address.address_line_one,
    city: address.city,
    state: address.state,
    zip_code: address.zip_code,
    latitude: address.latitude,
    longitude: address.longitude,
  });
  const result = await addressToSave.save();
  return result;
};

export { cacheLookup, cacheInsert };
