import { sequelizeConnect } from "../../src/configs/connect.js";
import { DateTime } from "luxon";
import { processUser } from "../../src/functions/send-email.js";
import fetchMock from "jest-fetch-mock";

describe("processUser", () => {
  beforeAll(async () => {
    // Run migrations and seed data before running the tests
    await sequelizeConnect().sync({ force: true });
  });

  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterAll(async () => {
    // Close the database connection after running the tests
    await sequelizeConnect().close();
  });

  test("should process user and send email", async () => {
    const datenow = DateTime.now().toFormat("yyyy-MM-dd");
    const user = {
      id: 1,
      first_name: "test1",
      last_name: "test1",
      location: "id",
      email: "test1@gmail.com",
      timezone: "America/New_York",
      event_date: {
        anniversary: datenow,
        birthday: datenow,
      },
    };
    const message = "Test Email";
    const type = "anniversary";

    fetchMock.mockResponseOnce("", { status: 200 });

    await processUser(user, message, type);
  });
});
