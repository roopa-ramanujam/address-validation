import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  addressLineOne: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
});

const Address = mongoose.model("Address", AddressSchema, "Address");
export default Address;
