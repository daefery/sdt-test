# SDT TEST

This is a guide how to setup and run the project.

## Run Locally

Clone the project

```bash
  git clone https://github.com/daefery/sdt-test.git
```

Go to the project directory

```bash
  cd sdt-test
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV` = `"TEST"` (when run the unit test)

`NODE_ENV` = `"DEV"` (when run the program/apps)

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

you can see the test result on github artifacts after `actions` to build and test are completed.

## Features

- Add new user
- Delete user
- Get all user data
- Update user data
- Sending certain type of message via email such as birthday, anniversary, etc and it will run periodically every day at 9am on user local time

## API Reference

#### Get all users

```http
  GET /users
```

#### Add new user

```http
  POST /users
```

| Parameter    | Type     | Required |
| :----------- | :------- | :------- |
| `first_name` | `string` | **Yes**  |
| `last_name`  | `string` | **Yes**  |
| `email`      | `string` | **Yes**  |
| `location`   | `string` | **Yes**  |
| `timezone`   | `string` | **Yes**  |
| `event_date` | `string` | **No**   |

#### Update user data

```http
  PUT /users/:id
```

| Parameter( in path) | Type     | Required |
| :------------------ | :------- | :------- |
| `id`                | `string` | **Yes**  |

| Parameter    | Type     | Required |
| :----------- | :------- | :------- |
| `first_name` | `string` | **No**   |
| `last_name`  | `string` | **No**   |
| `email`      | `string` | **No**   |
| `location`   | `string` | **No**   |
| `timezone`   | `string` | **No**   |
| `event_date` | `string` | **No**   |

#### Delete user data

```http
  DELETE /users/:id
```

| Parameter( in path) | Type     | Required |
| :------------------ | :------- | :------- |
| `id`                | `string` | **Yes**  |

## Appendix

#### Swagger documentation

you can visit on this path `http://localhost:3005/api-docs`

## Tech Stack

**Server:** Node, Express, sequelize, sqlite3

**Plugins:** dotenv, jest, supertest, luxon, node-cron
