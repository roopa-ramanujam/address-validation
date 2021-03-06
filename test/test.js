import { app } from "../server.js";
import chai, { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";
import chaiHttp from "chai-http";

import * as addressCache from "../cache/addressCache.js";
import { cacheLookup, cacheInsert } from "../cache/addressCache.js";
import { validateAddress } from "../api/controllers/addressValidations.js";

describe("Bulk address validation endpoint request validation", () => {
  it("should return http status code 207 - multipart response - if the overall request is valid", async () => {
    let addresses = [
      {
        address_line_one: "620 Atlantic Avenue",
        city: "Brooklyn",
        state: "NY",
        zip_code: "11217",
      },
    ];
    chai.use(chaiHttp);
    const res = await chai
      .request(app)
      .post("/api/addressValidations")
      .send(addresses);
    expect(res).to.have.status(207);
  });
  it("should return http status code 207 - multipart response - and a specific status/error code if the overall request is valid but one of the address objects is not", async () => {
    let addresses = [
      {
        city: "Brooklyn",
        state: "NY",
        zip_code: "11217",
      },
    ];
    chai.use(chaiHttp);
    const res = await chai
      .request(app)
      .post("/api/addressValidations")
      .send(addresses);
    expect(res).to.have.status(207);
    expect(res.body[0]).to.have.property("status", 400);
    expect(res.body[0].body).to.have.property(
      "error",
      "Missing required parameters"
    );
  });
  it("should return a 400 error if the request is not an array format", async () => {
    let addresses = {
      address_line_one: "620 Atlantic Ave",
      city: "Brooklyn",
      state: "NY",
      zip_code: "11217",
    };
    chai.use(chaiHttp);
    const res = await chai
      .request(app)
      .post("/api/addressValidations")
      .send(addresses);
    expect(res).to.have.status(400);
  });
  it("should return a 400 error if the request is empty", async () => {
    let addresses = [];
    chai.use(chaiHttp);
    const res = await chai
      .request(app)
      .post("/api/addressValidations")
      .send(addresses);
    expect(res).to.have.status(400);
  });
  it("should return a 400 error if the request is more than 5 addresses", async () => {
    let addresses = [
      {
        address_line_one: "620 Atlantic Ave",
        city: "Brooklyn",
        state: "NY",
        zip_code: "11217",
      },
      {
        address_line_one: "620 Atlantic Ave",
        city: "Brooklyn",
        state: "NY",
        zip_code: "11217",
      },
      {
        address_line_one: "620 Atlantic Ave",
        city: "Brooklyn",
        state: "NY",
        zip_code: "11217",
      },
      {
        address_line_one: "620 Atlantic Ave",
        city: "Brooklyn",
        state: "NY",
        zip_code: "11217",
      },
      {
        address_line_one: "620 Atlantic Ave",
        city: "Brooklyn",
        state: "NY",
        zip_code: "11217",
      },
      ,
      {
        address_line_one: "620 Atlantic Ave",
        city: "Brooklyn",
        state: "NY",
        zip_code: "11217",
      },
    ];
    chai.use(chaiHttp);
    const res = await chai
      .request(app)
      .post("/api/addressValidations")
      .send(addresses);
    expect(res).to.have.status(400);
  });
});

describe("Bulk address validation endpoint response validation", () => {
  // need to fix mocking/stubbing functions from addressValidations and addressCache to unit test the rest of the validation endpoint
  // test cases:
  // should not call validateAddress or cacheInsert if cacheLookup returns non-null value
  // should call validateAddress and cacheInsert if cacheLookup return value is null
  // should return multipart response matching number of requests sent in array with success or error messages
  // it("should not call validateAddress or cacheInsert if cacheLookup return value is not null", async () => {
  //   let addresses = [
  //     {
  //       address_line_one: "620 Atlantic Ave",
  //       city: "Brooklyn",
  //       state: "NY",
  //       zip_code: "11217",
  //     },
  //   ];
  //   chai.use(chaiHttp);
  //   const validateAddressSpy = sinon.spy(validateAddress);
  //   const cacheInsertSpy = sinon.spy(cacheInsert);
  //   sinon.stub(addressCache, "cacheLookup").returns({
  //     id: "someId",
  //     address_line_one: "620 Atlantic Ave",
  //     city: "Brooklyn",
  //     state: "NY",
  //     zip_code: "11217",
  //     latitude: "42.00",
  //     longitude: "73.00",
  //   });
  //   const res = await chai
  //     .request(app)
  //     .post("../api/controllers/addressValidations.js")
  //     .send(addresses);
  //   expect(res).to.have.status(207);
  //   expect(validateAddressSpy).not.to.be.called();
  //   expect(cacheInsertSpy).not.to.be.called();
  // });
  // it("should call validateAddress and cacheInsert if cacheLookup return value is null", async () => {
  //   let addresses = [
  //     {
  //       address_line_one: "620 Atlantic Ave",
  //       city: "Brooklyn",
  //       state: "NY",
  //       zip_code: "11217",
  //     },
  //   ];
  //   chai.use(chaiHttp);
  //   const validateAddressSpy = sinon.spy(validateAddress);
  //   const cacheInsertSpy = sinon.spy(cacheInsert);
  //   sinon.stub(addressCache, "cacheLookup").returns(null);
  //   const res = await chai
  //     .request(app)
  //     .post("../api/controllers/addressValidations.js")
  //     .send(addresses);
  //   expect(res).to.have.status(207);
  //   expect(validateAddressSpy).to.be.called();
  //   expect(cacheInsertSpy).to.be.called();
  // });
});
