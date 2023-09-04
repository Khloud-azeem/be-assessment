import supertest from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const request = supertest(app);

//performed some of the possible test cases, not all
describe("handlers/checks endpoint", () => {
  let token;
  beforeAll(async () => {
    //log user in and store token
    const user = {
      user_name: "khloud",
      password: "password123",
    };
    token = jwt.sign(
      {
        user_name: user.user_name,
        password: user.password,
      },
      process.env.TOKEN_SECRET,
    );
  });

  describe("getByUserId", () => {
    it("should get all checks associated with a user by user ID and return a JSON response", async () => {
      const response = await request
        .post("/api/checks")
        .set({ authorization: `Bearer ${token}` });
      expect(response.status.toBe(200));
    });
  });

  describe("create", () => {
    const check = {
      name: "test-check",
      url: "http://127.0.0.1:3000/api",
      protocol: "HTTPS",
    };
    it("should create new check associated with an existed user and return a JSON response", async () => {
      const response = await request
        .post("/api/checks/create")
        .send(check)
        .set({ authorization: `Bearer ${token}` });
      expect(response.status.toBe(200));
    });
  });
});
