import { sequelizeConnect } from "../../src/configs/connect.js";

describe("Test Database Connection", () => {
  test("should return a Sequelize instance", () => {
    const db = sequelizeConnect();
    expect(db).toBeDefined();
    expect(db.constructor.name).toBe("Sequelize");
  });

  test("should have correct database configuration", () => {
    const db = sequelizeConnect();
    expect(db.config.database).toBe("database");
    expect(db.config.username).toBe("username");
    expect(db.config.password).toBe("password");
    expect(db.config.host).toBe("./dev.sqlite");
  });
});
