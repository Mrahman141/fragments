# fragments

A node.js based REST API using Express for Cloud Computing for Programmers Course

## Development Dependencies

The following packages are used during the development process:

- **[@eslint/js](https://www.npmjs.com/package/@eslint/js)**: ESLint is a tool for identifying and fixing potential issues in JavaScript code. This package provides the core functionality for ESLint.
- **[cross-env](https://www.npmjs.com/package/cross-env)**: A tool for setting environment variables across different platforms in a uniform manner.
- **[eslint](https://www.npmjs.com/package/eslint)**: A popular JavaScript linter that analyzes your code to find and fix problems.
- **[globals](https://www.npmjs.com/package/globals)**: Provides a list of global variables to be used in ESLint configurations.
- **[nodemon](https://www.npmjs.com/package/nodemon)**: A utility that monitors for changes in your source and automatically restarts your Node.js application during development.
- **[prettier](https://www.npmjs.com/package/prettier)**: An opinionated code formatter to maintain consistent code style across your project.

## Production Dependencies

These dependencies are necessary for the application to function in production:

- **[aws-jwt-verify](https://www.npmjs.com/package/aws-jwt-verify)**: A library for verifying JSON Web Tokens (JWTs) issued by Amazon Cognito and other AWS services.
- **[compression](https://www.npmjs.com/package/compression)**: Middleware for Express that compresses HTTP responses to improve performance.
- **[cors](https://www.npmjs.com/package/cors)**: Provides middleware to enable Cross-Origin Resource Sharing (CORS) in Express apps.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Loads environment variables from a `.env` file into `process.env`, enhancing security and flexibility.
- **[express](https://www.npmjs.com/package/express)**: A fast, unopinionated, minimalist web framework for Node.js.
- **[helmet](https://www.npmjs.com/package/helmet)**: Helps secure your Express app by setting various HTTP headers.
- **[passport](https://www.npmjs.com/package/passport)**: Simple, unobtrusive authentication for Node.js, supporting a wide range of strategies.
- **[passport-http-bearer](https://www.npmjs.com/package/passport-http-bearer)**: HTTP Bearer authentication strategy for Passport, used for securing APIs.
- **[pino](https://www.npmjs.com/package/pino)**: A fast and low-overhead logging library for Node.js.
- **[pino-http](https://www.npmjs.com/package/pino-http)**: HTTP logger for Express compatible with Pino.
- **[pino-pretty](https://www.npmjs.com/package/pino-pretty)**: Adds human-readable formatting to Pino logs during development.
- **[stoppable](https://www.npmjs.com/package/stoppable)**: Adds graceful shutdown capability to an HTTP server to handle active connections properly.

## Running the Application

- For production, simply run:

  ```
  npm start
  ```

- To start the application in development mode, run:

  ```
  npm run dev
  ```

  This will use [nodemon](https://www.npmjs.com/package/nodemon) to automatically restart the server when file changes are detected.

- To start the application in debugger mode, run:
  ```
  npm run debug
  ```

## Linting

- To check for code issues using ESLint, run:
  ```
  npm run lint
  ```

## Environment Variables

This file contains the environment variables needed for configuring the application. Make sure to fill in the appropriate values before starting the server.

## Environment Variables

- **`PORT`**:  
  The port on which the server should run.

- **`LOG_LEVEL`**:  
  Specifies which log messages to display. Common options are:

  - `info` (for production)
  - `debug` (for development)
  - `silent` (to disable logging)

- **`AWS_COGNITO_POOL_ID`**:  
  The Amazon Cognito User Pool ID for AWS. This value should be obtained from your AWS Cognito setup.

- **`AWS_COGNITO_CLIENT_ID`**:  
  The Client App ID associated with the User Pool in AWS Cognito.

## API Routes

### Health Check

- **Route:** `/`
- **Method:** `GET`
- **Description:** Returns a 200 'OK' response with repository information.
- **Response:** `200 OK`

### 404 Not Found

- **Route:** `*`
- **Method:** Any
- **Description:** Returns a 404 error for undefined routes.
- **Response:** `404 Not Found`

### Get a list of fragments for the current user

- **Route:** `/v1/fragments`
- **Method:** `GET`
- **Description:** An authenticated route for the current user to get a list of fragments
- **Response:** `200 OK`, `401 Unauthorized`
