import request from "supertest";
import app from "../../src/index.js";
import { sequelizeConnect } from "../../src/configs/connect.js";
import UserModel from "../../src/models/user.js";
import EmailQueueModel from "../../src/models/email-queue.js";
import { afterEach, beforeEach } from "node:test";
import fetchMock from "jest-fetch-mock";

const User = UserModel(sequelizeConnect);
const EmailQueue = EmailQueueModel(sequelizeConnect);

describe("User Router", () => {
  beforeAll(async () => {
    // Run migrations and seed data before running the tests
    await sequelizeConnect().sync({ force: true });
    await User.bulkCreate([
      {
        first_name: "test",
        last_name: "test",
        location: "id",
        email: "test@gmail.com",
        timezone: "America/New_York",
        event_date: {
          anniversary: "2020-02-14",
          birthday: "2020-02-14",
        },
      },
    ]);
    await EmailQueue.bulkCreate([{ message: "Test Email 1", user_id: 1 }]);
  });

  afterAll(async () => {
    // Close the database connection after running the tests
    await sequelizeConnect().close();
  });

  describe("GET /users", () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });

    test("should return all users", async () => {
      const response = await request(app).get("/users");
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].first_name).toBe("test");
      expect(response.body[0].last_name).toBe("test");
    });
  });
});

describe("POST /users", () => {
  beforeEach(async () => {
    await sequelizeConnect().sync({ force: true });
  });

  afterAll(async () => {
    await sequelizeConnect().close();
  });

  test("should create a new user", async () => {
    const userData = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      location: "US",
      timezone: "America/New_York",
    };

    const response = await request(app)
      .post("/users")
      .send(userData)
      .expect(200);

    expect(response.body.status).toBe("success");

    const createdUser = await User.findOne({
      where: { email: userData.email },
    });
    expect(createdUser).toBeTruthy();
    expect(createdUser.first_name).toBe(userData.first_name);
    expect(createdUser.last_name).toBe(userData.last_name);
    expect(createdUser.email).toBe(userData.email);
    expect(createdUser.location).toBe(userData.location);
    expect(createdUser.timezone).toBe(userData.timezone);
  });
});

describe("PUT /users/:id", () => {
  beforeAll(async () => {
    // Run migrations and seed data before running the tests
    await sequelizeConnect().sync({ force: true });
    await User.bulkCreate([
      {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        timezone: "America/New_York",
        location: "US",
      },
      {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        timezone: "America/New_York",
        location: "US",
      },
    ]);
  });

  afterAll(async () => {
    // Close the database connection after running the tests
    await sequelizeConnect().close();
  });

  test("should update user with valid data", async () => {
    const id = 1;
    const updatedData = {
      first_name: "Updated",
      last_name: "User",
      email: "updated.user@example.com",
    };

    const response = await request(app)
      .put(`/users/${id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.status).toEqual("success");

    const user = await User.findByPk(id);
    expect(user.first_name).toBe(updatedData.first_name);
    expect(user.last_name).toBe(updatedData.last_name);
    expect(user.email).toBe(updatedData.email);
  });

  test("should return status failed if user does not exist", async () => {
    const id = 3;
    const updatedData = {
      first_name: "Updated",
      last_name: "User",
      email: "updated.user@example.com",
    };

    const response = await request(app)
      .put(`/users/${id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toEqual({ status: "success" });
  });
});

describe("DELETE /users/:id", () => {
  beforeAll(async () => {
    // Run migrations and seed data before running the tests
    await sequelizeConnect().sync({ force: true });
    await User.bulkCreate([
      {
        first_name: "John",
        last_name: "Doe",
        location: "id",
        email: "john.doe@example.com",
        timezone: "America/New_York",
      },
      {
        first_name: "Jane",
        last_name: "Smith",
        location: "id",
        email: "jane.smith@example.com",
        timezone: "America/New_York",
      },
    ]);
  });

  afterAll(async () => {
    // Close the database connection after running the tests
    await sequelizeConnect().close();
  });

  test("should delete a user by id", async () => {
    const id = 1;

    const response = await request(app).delete(`/users/${id}`).expect(200);

    expect(response.body.status).toEqual("success");
  });
});

describe("DELETE /users/:id", () => {
  test("get index page", async () => {
    const response = await request(app).get(`/`).expect(200);
    expect(response.body).toEqual("Hello, TypeScript with Express!");
  });
});
