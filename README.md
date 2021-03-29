# Mana Server | Node.js/Express

Link to front end client: https://mana-client.vercel.app/

## About the Mana Server

This server is built using Node.js/Express with the purpose of being the API/backend for my app "Mana" which allows Users to create and track a daily routine (or practice as I like to call it).

## Documentation

### Endpoints

#### Login Endpoint

`POST /api/login`

| Body Key     | Type     | Description                         |
| :----------- | :------- | :---------------------------------- |
| `user_name`  | `string` |      user_name is required          |
| `password`   | `string` |      password is required          |

#### Register User Endpoint

`POST /api/user`

| Body Key     | Type     | Description                         |
| :----------- | :------- | :---------------------------------- |
| `first_name` | `string` |      first_name is required         |
| `last_name`  | `string` |      last_name is required          |
| `user_name`  | `string` |      user_name is required          |
| `password`   | `string` |      password is required           |

#### Practice Endpoints

- Get user Practice
`GET /api/practice`

- Get Practice details
`GET /api/practice/:practiceId`

- Delete Practice
`DELETE /api/practice/:practiceId`

### Edit Practice Route
`PATCH /api/practice/:practiceId`

| Body Key            | Type      | Description                        |
| :------------------ | :-------  | :--------------------------------- |
|   `practice_name`   |  `string` |  Name of the practice (Required)      |
|   `days_to_track`   |  `string` |  how many days does the user want to track (Required) |
|     `date_start`    |  `string` |  this is a timestamp that is created server side when practice is created    |
|   `dates_complete`  |  `string` |  these are the dates marked as complete (practice complete when "days_left" - "dates_complete.length" = 0 )   |
|  `dates_incomplete` |  `string` |  these are the dates marked as incomplete    |
|      `user_id`      | `integer` |  user_id is (Required)     |

### Status Codes

This API returns the following status codes:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |

### Technology Used

- Node.js
- Express
- PostgreSQL
- Testing with Mocha and Chai

#### To install locally

- Clone the github repo to your machine.
- Run 'npm install' in git
- Run 'npm start'