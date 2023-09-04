# Overview

This is an uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

This API is built using NodeJS and Express, MongoDB as a database, and Jasmine for unit testing the application.

The API allows: 
- Sign up with email verification.
-  Authenticated users can perform CRUD operations for URL checks (`GET`, `PUT`, and `DELETE`).
- Authenticated users can receive a notification whenever one of their URLs goes down or up again on :
  - Email.
  - Webhook or any other channel by providing the email address of it.
- Authenticated users can get detailed uptime reports about their URLs availability, average response time, and total uptime/downtime.
- Authenticated users can group their checks by tags and get reports by tag.
- API uses stateless authentication using JWT.
- API consumes and produces `application/json`.

## Getting started

### Database

Try your best to implement as much as you can from the given requirements and feel free to add more if you want to.

### Environment

Create .env file in the root directory of your project and add the following environment variables:
```
ENV = dev

MONGO_DB_URI = {Your MongoDB development database URI}
MONGO_TEST_DB_URI = {Your MongoDB development database URI}

SALT_ROUNDS = 10
TOKEN_SECRET = {Uique password}

VERIFICATION_EMAIL = {A working email address}
VERIFICATION_PASSWORD = {The password of this email}
```

### Installation

Run this command in the project directory terminal to install npm packages.
```
npm install
```

### Run the app

Run this command in the project directory terminal to run the application 
```
npm run start
```

### Test the app

Change the ENV variable in the .env file to test
```
ENV = test
```
Run this command in the project directory terminal to run unit tests for the application
```
npm run jasmine
```

### Run Docker image

Run this command in the project directory terminal to run Docker compose
```
docker-compose -f docker-compose.yml up
```

### Endpoints

|Path|HTTP method|Description|
|---|---|---|
|/api|POST|root endpoint for api|
|/api/login|POST|logs existing user in using username and password|
|/api/signup|POST|creates new user|
|/api/verify|POST|verifies user's email address|
|/api/checks|GET|gets all checks associated with a specific user|
|/api/checks/create|POST|creates new check|
|/api/checks/update|POST|updates an existing check using its name|
|/api/checks/delete|POST|deletes an existing check using its name|
|/api/report|POST|gets a report using its report id|
|/api/reports/getByTags|POST|gets reports for checks grouped by tags|
