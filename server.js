import mongoose from "mongoose";
import dotenv from "dotenv";
import express, { json } from "express";

import {
  standardizeAddress,
  validateAddress,
  isAddressRequestValid,
} from "./api/controllers/addressValidations.js";

import { cacheLookup, cacheInsert } from "./cache/addressCache.js";

import { isArray } from "./utils.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(json());

app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/index.html");
});

app.post("/api/addressValidations", async (req, res) => {
  const addressList = req.body;
  if (
    !isArray(addressList) ||
    addressList.length === 0 ||
    addressList.length > 5
  ) {
    return res.status(400).send("Invalid request format");
  }
  const responseList = [];
  for (let addressObj in addressList) {
    const address = {
      addressLineOne: addressList[addressObj].address_line_one,
      city: addressList[addressObj].city,
      state: addressList[addressObj].state,
      zipCode: addressList[addressObj].zip_code,
    };
    let response = {};
    const isValidRequest = isAddressRequestValid(address);
    if (!isValidRequest) {
      response.status = 400;
      response.body = {
        error: "Missing required parameters",
      };
    } else {
      const standardizedAddress = standardizeAddress(address);
      const entry = await cacheLookup(standardizedAddress);
      if (entry) {
        response.status = 200;
        response.body = {
          address_line_one: entry.addressLineOne,
          city: entry.city,
          state: entry.state,
          zip_code: entry.zipCode,
          latitude: entry.latitude,
          longitude: entry.longitude,
        };
      } else {
        const validatedAddress = await validateAddress(address);
        const isAddressValid = Object.keys(validatedAddress).length > 0;
        if (isAddressValid) {
          const standardizedValidatedAddress =
            standardizeAddress(validatedAddress);
          await cacheInsert(standardizedValidatedAddress);
          response.status = 200;
          response.body = {
            address_line_one: standardizedValidatedAddress.addressLineOne,
            city: standardizedValidatedAddress.city,
            state: standardizedValidatedAddress.state,
            zip_code: standardizedValidatedAddress.zipCode,
            latitude: standardizedValidatedAddress.latitude,
            longitude: standardizedValidatedAddress.longitude,
          };
        } else {
          response.status = 404;
          response.body = { error: "Address not found" };
        }
      }
    }
    responseList.push(response);
  }
  res.status(207).json(responseList);
});

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.listen(port);

export { app };
