import { sequelizeConnect } from "../../src/configs/connect.js";
import { DateTime } from "luxon";
import { processUser } from "../../src/functions/send-email.js";
import fetchMock from "jest-fetch-mock";
import { jest } from "@jest/globals";

jest.useFakeTimers();

describe("processUser", () => {
  beforeAll(async () => {
    // Run migrations and seed data before running the tests
    await sequelizeConnect().sync({ force: true });
  });

  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    jest.clearAllMocks();
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

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "sent",
        sentTime: "2022-07-01T14:48:00.000Z",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    await processUser(user, message, type);
    jest.advanceTimersByTime(1000);
  });
});
