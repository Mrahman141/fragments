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

- **[compression](https://www.npmjs.com/package/compression)**: Middleware for Express that compresses HTTP responses to improve performance.
- **[cors](https://www.npmjs.com/package/cors)**: A package that provides middleware to enable Cross-Origin Resource Sharing (CORS) in Express apps.
- **[express](https://www.npmjs.com/package/express)**: A fast, unopinionated, minimalist web framework for Node.js.
- **[helmet](https://www.npmjs.com/package/helmet)**: Helps secure your Express app by setting various HTTP headers.
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
