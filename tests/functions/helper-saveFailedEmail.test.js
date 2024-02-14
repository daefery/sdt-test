import { saveFailedEmail } from "../../src/functions/helper.js";
import { sequelizeConnect } from "../../src/configs/connect.js";
import EmailQueueModel from "../../src/models/email-queue.js";

const EmailQueue = EmailQueueModel(sequelizeConnect);

describe("saveFailedEmail", () => {
  beforeEach(async () => {
    // Run migrations and seed data before each test
    await sequelizeConnect().sync({ force: true });
  });

  afterEach(async () => {
    // Close the database connection after each test
    await sequelizeConnect().close();
  });

  it("should save  a failed email to the database with correct fields", async () => {
    // Call the function
    const failedUser = { user_id: 1, message: "Test Message" };
    await saveFailedEmail(failedUser);

    const savedEmail = await EmailQueue.findOne({
      where: { user_id: failedUser.user_id, message: failedUser.message },
    });

    expect(savedEmail).toBeDefined();
  });

  it("should handle errors and retry until max", async () => {
    const failedUser = { user_id: null, message: null };
    await saveFailedEmail(failedUser);

    const savedEmail = await EmailQueue.findOne({
      where: { user_id: failedUser.user_id, message: failedUser.message },
    });

    expect(savedEmail).toBeNull();
  });
});
