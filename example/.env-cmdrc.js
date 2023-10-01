const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  production: {
    NODE_ENV: "production",
    GAME: "PRD",
  },
  public_test: {
    NODE_ENV: "public-test",
    GAME: "PTR",
  },
  development: {
    NODE_ENV: "development",
    GAME: "DEV",
  },
};
