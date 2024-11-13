# fragments

A node.js based REST API using Express for Cloud Computing for Programmers Course

## Development Dependencies

The following packages are used during the development process:

- **[@eslint/js](https://www.npmjs.com/package/@eslint/js)**: ESLint is a tool for identifying and fixing potential issues in JavaScript code. This package provides the core functionality for ESLint.
- **[@orangeopensource/hurl](https://www.npmjs.com/package/@orangeopensource/hurl)**: A testing tool for HTTP requests that supports a simple syntax for defining HTTP calls.
- **[cross-env](https://www.npmjs.com/package/cross-env)**: A tool for setting environment variables across different platforms in a uniform manner.
- **[eslint](https://www.npmjs.com/package/eslint)**: A popular JavaScript linter that analyzes your code to find and fix problems.
- **[globals](https://www.npmjs.com/package/globals)**: Provides a list of global variables to be used in ESLint configurations.
- **[jest](https://www.npmjs.com/package/jest)**: A JavaScript testing framework designed to ensure correctness of any JavaScript codebase.
- **[nodemon](https://www.npmjs.com/package/nodemon)**: A utility that monitors for changes in your source and automatically restarts your Node.js application during development.
- **[prettier](https://www.npmjs.com/package/prettier)**: An opinionated code formatter to maintain consistent code style across your project.
- **[supertest](https://www.npmjs.com/package/supertest)**: A library for testing HTTP servers, allowing assertions on HTTP requests and responses.

## Production Dependencies

These dependencies are necessary for the application to function in production:

- **[@aws-sdk/client-dynamodb](https://www.npmjs.com/package/@aws-sdk/client-dynamodb)**: AWS SDK for DynamoDB, providing API support for interacting with DynamoDB in Node.js applications.
- **[@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3)**: AWS SDK for S3, providing API support for interacting with S3 storage services in Node.js applications.
- **[@aws-sdk/lib-dynamodb](https://www.npmjs.com/package/@aws-sdk/lib-dynamodb)**: A higher-level DynamoDB client library that makes working with DynamoDB in Node.js simpler.
- **[aws-jwt-verify](https://www.npmjs.com/package/aws-jwt-verify)**: A library for verifying JSON Web Tokens (JWTs) issued by Amazon Cognito and other AWS services.
- **[compression](https://www.npmjs.com/package/compression)**: Middleware for Express that compresses HTTP responses to improve performance.
- **[cors](https://www.npmjs.com/package/cors)**: Provides middleware to enable Cross-Origin Resource Sharing (CORS) in Express apps.
- **[crypto](https://www.npmjs.com/package/crypto)**: A module to provide cryptographic functionalities in Node.js applications.
- **[csvtojson](https://www.npmjs.com/package/csvtojson)**: A library that converts CSV data to JSON format, making it easier to work with CSV data in Node.js applications.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Loads environment variables from a `.env` file into `process.env`, enhancing security and flexibility.
- **[express](https://www.npmjs.com/package/express)**: A fast, unopinionated, minimalist web framework for Node.js.
- **[helmet](https://www.npmjs.com/package/helmet)**: Helps secure your Express app by setting various HTTP headers.
- **[http-auth](https://www.npmjs.com/package/http-auth)**: A simple HTTP authentication library for Node.js that supports Basic, Digest, and more.
- **[http-auth-passport](https://www.npmjs.com/package/http-auth-passport)**: A package that integrates `http-auth` with the `passport.js` authentication middleware.
- **[js-yaml](https://www.npmjs.com/package/js-yaml)**: A library to parse and stringify YAML, allowing easy configuration management.
- **[markdown-it](https://www.npmjs.com/package/markdown-it)**: A fast, full-featured Markdown parser and renderer for Node.js, supporting CommonMark and GitHub Flavored Markdown.
- **[passport](https://www.npmjs.com/package/passport)**: Simple, unobtrusive authentication for Node.js, supporting a wide range of strategies.
- **[passport-http-bearer](https://www.npmjs.com/package/passport-http-bearer)**: HTTP Bearer authentication strategy for Passport, used for securing APIs.
- **[pino](https://www.npmjs.com/package/pino)**: A fast and low-overhead logging library for Node.js.
- **[pino-http](https://www.npmjs.com/package/pino-http)**: HTTP logger for Express compatible with Pino.
- **[pino-pretty](https://www.npmjs.com/package/pino-pretty)**: Adds human-readable formatting to Pino logs during development.
- **[sharp](https://www.npmjs.com/package/sharp)**: A high-performance image processing library for Node.js.
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

## Testing

- To run unit tests, run:

  ```
  npm run test
  ```

- To run unit tests for a specific file, run:

  ```
  npm run test:watch {Uni_test_file_name}
  ```

- To see the unit test coverage, run:

  ```
  npm run coverage
  ```

## Environment Variables

This file contains the environment variables needed for configuring the application. Make sure to fill in the appropriate values before starting the server.

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

- **`HTPASSWD_FILE`**:  
  Path to the file used for Basic Authentication credentials

- **`NODE_ENV`**:  
  Specifies the environment in which the application is running (e.g., development, production, test).
  
- **`AWS_S3_BUCKET_NAME`**:  
  The name of the Amazon S3 bucket where files (such as images, documents, or other assets) are stored. 

- **`AWS_DYNAMODB_TABLE_NAME`**:  
  The name of the table in Amazon DynamoDB, a NoSQL database service, where application data (such as user records or metadata) is stored.

- **`AWS_ACCESS_KEY_ID`**:  
  The access key ID associated with your AWS account. 

- **`AWS_SECRET_ACCESS_KEY`**:  
  The secret access key associated with your AWS account.

- **`AWS_SESSION_TOKEN`**:  
  A temporary session token used for temporary security credentials when accessing AWS services, often generated via AWS Security Token Service (STS).

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

- **Route:** `/v1/fragments/?expand=1`
- **Method:** `GET`
- **Description:** An authenticated route for the current user to get a list of fragments and more infroamtion about the fragment if they want.
- **Response:** `200 OK`, `401 Unauthorized`, `500 Internal Server Error`

### Get a fragment data for the current user by fragment Id

- **Route:** `/v1/fragments/:id`
- **Method:** `GET`
- **Description:** Gets an authenticated user's fragment data (i.e., raw binary data) with the given id.
- **Response:** `200 OK`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

### Conversion of a Fragment data

- **Route:** `/v1/fragments/:id.ext`
- **Method:** `GET`
- **Description:** Gets an authenticated user's fragment data (i.e., raw binary data) with the given id with the specified format.
- **Response:** `200 OK`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`, `415 Unsupported Media Type`

### Get a fragment metadata information for the current user by fragment Id

- **Route:** `/v1/fragments/:id/info`
- **Method:** `GET`
- **Description:** Allows the authenticated user to get (i.e., read) the metadata for one of their existing fragments with the specified id.
- **Response:** `200 OK`, `401 Unauthorized`, `404 Not Found`

### Post a fragment for the current user

- **Route:** `/v1/fragments`
- **Method:** `POST`
- **Description:** An authenticated route for the current user to post a fragments for a specific type of media.
- **Response:** `200 OK`, `401 Unauthorized`, `415 Unsupported Media Type`, `500 Internal Server Error`


### Update a fragment for the current user

- **Route:** `/v1/fragments/:id`
- **Method:** `PUT`
- **Description:** An authenticated route for the current user to update a fragments data.
- **Response:** `200 OK`, `401 Unauthorized`, `415 Unsupported Media Type`, `500 Internal Server Error`, `404 Not Found`, `400 Fragment Type Mismatch`

### Delete a fragment for the current user

- **Route:** `/v1/fragments/:id`
- **Method:** `DELETE`
- **Description:** An authenticated route for the current user to Delete a fragment.
- **Response:** `200 OK`, `404 Not Found`
