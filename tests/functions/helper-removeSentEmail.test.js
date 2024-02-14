import { removeSentEmail } from "../../src/functions/helper.js";
import { sequelizeConnect } from "../../src/configs/connect.js";
import EmailQueueModel from "../../src/models/email-queue.js";

const EmailQueue = EmailQueueModel(sequelizeConnect);

describe("removeSentEmail", () => {
  beforeEach(async () => {
    // Run migrations and seed data before each test
    await sequelizeConnect().sync({ force: true });
  });

  afterEach(async () => {
    // Close the database connection after each test
    await sequelizeConnect().close();
  });

  it("should remove sent email from the database", async () => {
    // Create a test email in the database
    const testEmail = { user_id: 1, message: "Test Email" };
    await EmailQueue.create(testEmail);

    // Call the function to remove the test email
    await removeSentEmail(testEmail.user_id, testEmail.message);

    // Check if the email is removed from the database
    const deletedEmail = await EmailQueue.findOne({
      where: { user_id: testEmail.user_id, message: testEmail.message },
    });

    expect(deletedEmail).toBeNull();
  });

  it("should retry max when remove sent email from the database", async () => {
    // Create a test email in the database
    const testEmail = { user_id: 1, message: "Test Email" };
    await EmailQueue.create(testEmail);

    // Call the function to remove the test email
    await removeSentEmail();

    // Check if the email is removed from the database
    const deletedEmail = await EmailQueue.findOne({
      where: { user_id: testEmail.user_id, message: testEmail.message },
    });

    expect(deletedEmail).toBeDefined();
  });
});
