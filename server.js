import mongoose from "mongoose";
import dotenv from "dotenv";
import express, { json } from "express";

import {
  validateAddress,
  isRequestValid,
} from "./api/controllers/addressValidations.js";

import { cacheLookup, cacheInsert } from "./cache/addressCache.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(json());

app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/index.html");
});

app.post("/addressValidations", async (req, res) => {
  const addressList = req.body;
  const responseList = [];
  for (let address in addressList) {
    let response = {};
    const isValidRequest = isRequestValid(addressList[address]);
    if (!isValidRequest) {
      response.status = 400;
      response.body = {
        error: "Invalid request",
      };
    } else {
      const entry = await cacheLookup(addressList[address]);
      if (entry) {
        response.status = 200;
        response.body = {
          address_line_one: entry.address_line_one,
          city: entry.city,
          state: entry.state,
          zip_code: entry.zip_code,
          latitude: entry.latitude,
          longitude: entry.longitude,
        };
      } else {
        const validatedAddress = await validateAddress(addressList[address]);
        const isAddressValid = Object.keys(validatedAddress).length > 0;
        if (isAddressValid) {
          const insertRes = await cacheInsert(validatedAddress);
          response.status = 200;
          response.body = validatedAddress;
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
