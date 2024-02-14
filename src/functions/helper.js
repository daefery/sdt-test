import UserModel from "../models/user.js";
import EmailQueueModel from "../models/email-queue.js";
import { sequelizeConnect } from "../configs/connect.js";
import { DateTime } from "luxon";
import { Op, Sequelize, where } from "sequelize";
const User = UserModel(sequelizeConnect);
const EmailQueue = EmailQueueModel(sequelizeConnect);
/**
 * Renders an error result for an failed attempt to save a user.
 *
 * @param {object} res - The response object for the current request.
 * @param {Error} error - The error object containing details about the failure.
 */
export function renderErrorResult(res, error) {
  res.status(500).json({
    error: "Something wrong on the process",
    details: {
      name: error.errors ? error.name : error.toString(),
      errors: error.errors?.map((e) => e.message),
    },
  });
}

/**
 * Returns an array of User objects that match the given eventType parameter.
 * The array will include User objects that have an event_date matching the current date
 * and User objects that have an EmailQueue message containing the eventType parameter.
 * @param {string} eventType - The event type to filter Users by.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 */
export async function getUserListRecipient(eventType) {
  // Get the current date and time and format it as a string in the format "yyyy-MM-dd"

  const today = DateTime.now();
  const todayString = today.toFormat("yyyy-MM-dd");
  // Define the association between User and EmailQueue models
  User.hasMany(EmailQueue, { foreignKey: "user_id" });
  EmailQueue.belongsTo(User, { foreignKey: "user_id" });

  // Initialize an empty array called usersWithDates
  let usersWithDates = [];
  try {
    // Define a where clause to filter Users by event_date
    const whereClause = {};
    whereClause[`event_date.${eventType}`] = {
      [Op.substring]: todayString.substring(5),
    };
    // Find all Users that match the where clause and store them in the usersWithDates array
    usersWithDates = await User.findAll({
      where: whereClause,
    });

    // Find all EmailQueue records that do not match the user_id or message in usersWithDates array
    const emailList = await EmailQueue.findAll({
      attributes: ["message"],
      include: [
        {
          model: User,
        },
      ],
      where: {
        user_id: {
          [Op.notIn]: usersWithDates.map((u) => u.id),
        },
        message: {
          [Op.notLike]: `%${eventType}%`,
        },
      },
    });

    // Combine the usersWithDates and emailList arrays
    usersWithDates = [...usersWithDates, ...emailList];
  } catch (error) {
    // Log any errors that occur during the execution of the function
    console.log(error.message);
  }

  // Return the final usersWithDates array
  return usersWithDates;
}

/**
 * Saves a failed email to the EmailQueue table.
 * If a record with the same user_id and message already exists, it will not be updated.
 * @param {Object} failedUser - An object containing the user_id and message properties.
 */
export async function saveFailedEmail(failedUser) {
  try {
    await EmailQueue.findOrCreate({
      where: { user_id: failedUser.user_id, message: failedUser.message },
      defaults: failedUser,
    });
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Removes a sent email from the EmailQueue table.
 * @param {number} id - The ID of the user associated with the email.
 * @param {string} message - The message of the email to be removed.
 */
export async function removeSentEmail(id, message) {
  try {
    await EmailQueue.destroy({ where: { user_id: id, message: message } });
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Returns a string containing a greeting message for an email.
 * @param {string} type - The type of event or activity for the email.
 * @param {string} fullname - The full name of the email recipient.
 * @returns {string} A string containing a greeting message for an email.
 */
export function getEmailMessage(type, fullname) {
  return `Hey, ${fullname} it's your ${type}`;
}
