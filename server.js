import dotenv from "dotenv";
import express, { json } from "express";
import {
  validateAddress,
  isRequestValid,
} from "./api/controllers/addressValidations.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(json());

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
      const validatedAddress = await validateAddress(addressList[address]);
      const isAddressValid = Object.keys(validatedAddress).length > 0;
      if (isAddressValid) {
        response.status = 200;
        response.body = validatedAddress;
      } else {
        response.status = 404;
        response.body = { error: "Address not found" };
      }
    }
    responseList.push(response);
  }
  res.status(207).json(responseList);
});
app.listen(port);
