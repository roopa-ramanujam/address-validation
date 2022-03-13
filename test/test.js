import assert from "assert";
import { app } from "../server.js";
import chai from "chai";
import chaiHttp from "chai-http";

describe("Bulk address validation endpoint", async () => {
  describe("/addressValidations", async () => {
    it("should return http status code 207 always", async (done) => {
      let address = {
        city: "Brooklyn",
        state: "NY",
        zip_code: "11201",
      };
      chai.use(chaiHttp);
      const res = await chai
        .request(app)
        .post("/addressValidations")
        .send(address)
        .end((res) => {
          res.should.have.status(207);
          done();
        });
    });
  });
});
