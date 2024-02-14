import { getUserListRecipient } from "../../src/functions/helper.js";
import { sequelizeConnect } from "../../src/configs/connect.js";
import UserModel from "../../src/models/user.js";
import EmailQueueModel from "../../src/models/email-queue.js";
import { DateTime } from "luxon";
import { sendEmail } from "../../src/functions/send-email.js";
import fetchMock from "jest-fetch-mock";
import { beforeEach } from "node:test";

const User = UserModel(sequelizeConnect);
const EmailQueue = EmailQueueModel(sequelizeConnect);

describe("sendEmail", () => {
  beforeAll(async () => {
    // Run migrations and seed data before running the tests
    const datenow = DateTime.now().toFormat("yyyy-MM-dd");
    await sequelizeConnect().sync({ force: true });
    await User.bulkCreate([
      {
        first_name: "test1",
        last_name: "test1",
        location: "id",
        email: "test1@gmail.com",
        timezone: "America/New_York",
        event_date: {
          anniversary: datenow,
          birthday: datenow,
        },
      },
      {
        first_name: "test2",
        last_name: "test2",
        location: "id",
        email: "test2@gmail.com",
        timezone: "America/New_York",
        event_date: {
          anniversary: datenow,
          birthday: datenow,
        },
      },
    ]);
    await EmailQueue.bulkCreate([
      { message: "Test Email 1", user_id: 1 },
      { message: "Test Email 2", user_id: 2 },
    ]);
  });

  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterAll(async () => {
    // Close the database connection after running the tests
    await sequelizeConnect().close();
  });

  test("should return users with matching event date", async () => {
    const eventType = "anniversary";
    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "sent",
        sentTime: "2022-07-01T14:48:00.000Z",
      })
    );
    await sendEmail(eventType);
  });

  test("should return users with matching event date 123", async () => {
    await sendEmail(undefined);
  });
});
