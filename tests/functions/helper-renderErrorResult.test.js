import {
  getEmailMessage,
  renderErrorResult,
} from "../../src/functions/helper.js";
import jest from "jest-mock";

describe("renderErrorResult", () => {
  test("should return a 500 status code and error message", () => {
    // Mock the response object
    const mockRes = {
      status: jest.fn().mockReturnThis(), // Mock the status method to return the mockRes object
      json: jest.fn(),
    };

    // Mock the error object
    const mockError = new Error("Test error");
    mockError.name = "ValidationError";
    mockError.errors = [{ message: "Validation failed" }];

    // Call the function
    renderErrorResult(mockRes, mockError);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Something wrong on the process",
      details: {
        name: "ValidationError",
        errors: ["Validation failed"],
      },
    });
  });
});

describe("getEmailMessage", () => {
  test("should return correct email message", () => {
    const msgBDay = getEmailMessage("birthday", "test123");
    expect(msgBDay).toBe("Hey, test123 it's your birthday");

    const msgAnniv = getEmailMessage("anniversary", "test123");
    expect(msgAnniv).toBe("Hey, test123 it's your anniversary");
  });
});
