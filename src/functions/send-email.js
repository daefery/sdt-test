import {
  getEmailMessage,
  getUserListRecipient,
  removeSentEmail,
  saveFailedEmail,
} from "./helper.js";
import { DateTime } from "luxon";

/**
 * Send an email to a list of recipients based on the provided `type`.
 *
 * @param {string} type - The type of email to send. Default is "birthday".
 */
export async function sendEmail(type) {
  // Call the `getUserListRecipient` function with the `type` parameter
  // and wait for the result
  const recipientList = await getUserListRecipient(type);
  // Wait for all the promises in the array returned by `map` to be resolved
  await Promise.all(
    // Map the `recipientList` array to a new array of promises
    recipientList.map((user) => {
      // If the `user` object has a `message` property
      if (user.message) {
        // Call the `processUser` function with the `User` property of the `user` object,
        // the `message` property of the `user` object, and the `type` parameter
        return processUser(user.User, user.message, type);
      } else {
        // Otherwise, call the `processUser` function with the `user` object,
        // the result of calling `getEmailMessage` function with the `type` parameter
        // and the first and last names of the `user` object, and the `type` parameter
        return processUser(
          user,
          getEmailMessage(type, `${user.first_name} ${user.last_name}`),
          type
        );
      }
    })
  );
}

/**
 * Process a user by scheduling an email to be sent to them at a later time.
 *
 * @param {object} user - The user object containing information about the user.
 * @param {string} message - The message to be sent to the user.
 * @param {string} type - The type of event for the user.
 */
export async function processUser(user, message, type) {
  // Convert the `event_date` property of the `user` object to a local date
  // using the `DateTime` library and the user's timezone, and set the year
  // to the current year
  const localDate = DateTime.fromISO(user["event_date"][type], {
    zone: user.timezone,
  }).set({ year: DateTime.local().year });

  // Set the send time to 9:00:00 AM on the same day as the local date

  const sendTime = localDate.set({
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  // Calculate the delay in milliseconds between the current time and the send time
  const delay = Math.max(0, sendTime.diffNow("milliseconds").milliseconds);
  // Set a timeout to send the email after the calculated delay
  setTimeout(
    async () => {
      // Send an email using the `fetch` API to the `email-service` endpoint
      const response = await fetch(
        `https://email-service.digitalenvision.com.au/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            message: message,
          }),
        }
      );

      // If the response status is not 200, save the failed email to a database
      if (response.status !== 200) {
        await saveFailedEmail({
          user_id: user.id,
          message: message,
        });
      } else {
        // Otherwise, remove the sent email from a database
        await removeSentEmail(user.id, message);
      }
    },
    // If the current environment is "test", set the delay to 0
    // Otherwise, use the calculated delay
    process.env.NODE_ENV === "test" ? 0 : delay
  );
}
