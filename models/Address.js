import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  address_line_one: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip_code: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
});

const Address = mongoose.model("Address", AddressSchema, "Address");
export default Address;
