import { getUserListRecipient } from "../../src/functions/helper.js";
import { sequelizeConnect } from "../../src/configs/connect.js";
import UserModel from "../../src/models/user.js";
import EmailQueueModel from "../../src/models/email-queue.js";
import { DateTime } from "luxon";

const User = UserModel(sequelizeConnect);
const EmailQueue = EmailQueueModel(sequelizeConnect);

describe("getUserListRecipient", () => {
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

  afterAll(async () => {
    // Close the database connection after running the tests
    await sequelizeConnect().close();
  });

  test("should return users with matching event date", async () => {
    const eventType = "anniversary";
    const usersWithDates = await getUserListRecipient(eventType);
    expect(usersWithDates).toHaveLength(2);
    expect(usersWithDates[0].first_name).toBe("test1");
    expect(usersWithDates[0].last_name).toBe("test1");
  });

  test("should return users with matching event date and email list", async () => {
    const eventType = "birthday";
    const usersWithDates = await getUserListRecipient(eventType);
    expect(usersWithDates).toHaveLength(2);
    expect(usersWithDates[0].first_name).toBe("test1");
    expect(usersWithDates[0].last_name).toBe("test1");
    expect(usersWithDates[1].first_name).toBe("test2");
    expect(usersWithDates[1].last_name).toBe("test2");
  });

  test("should throw an error when an exception occurs", async () => {
    await getUserListRecipient([]);
  });
});
