# Custom Logger
A custom logger utility for Node.js with configurable styles and features.

### Installation
```bash
# Clone the repository
git clone git@github.com:NabinSaru/j-logger.git
cd J-LOGGER

# Install dependencies
npm install
```

### Usage
```javascript
// Import the JLogger class and other required modules
import { JLogger, requestLogger } from "j-logger";

// Set custom log styles
JLogger.TextColor = "White";
JLogger.BackgroundColor = "Black";
JLogger.TextFormat = ["Bold", "Underline"];
JLogger.StylizedMode = true;

// Use the logger
JLogger.log("This is a log message.");
JLogger.info("This is an info message.");
JLogger.error("This is an error message.");
JLogger.warn("This is a warning message.");
JLogger.debug("This is a debug message.");

// Use requestLogger middleware
app.use(requestLogger("REQUEST"));

// Log types
const logTypes = JLogger.getLogTypes();
console.log("Available log types:", logTypes);
```

### Configuration
The logger can be configured using a JSON file(Optional). Fields are also optionals. Create a j-logger.config.json file with the following structure:

```json
{
  "color": "White",
  "backgroundColor": "Black",
  "saveLog": true,
  "logPath": "/log/j-logger.log",
  "textFormat": ["Bold", "Underline"],
  "stylizedMode": true
}
```

### Middleware Usage
The requestLogger middleware can be used to log HTTP request details.

```javascript
const express = require("express");
const { requestLogger } = require("j-logger");

const app = express();

// Use requestLogger middleware for logging requests
// Provide log format type
app.use(requestLogger("common"));

// Your routes and other middleware...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

Request logger supports 4 distinct log types.
- common
```sh
::1 - - [Wed, 13 Dec 2023 05:34:25 GMT] "GET / HTTP/1.1" 200 15 "-" "PostmanRuntime/7.29.4"
```

- dev
```sh
GET / 200 5 ms - 15
```

- combined
```sh
::1 - - [Wed, 13 Dec 2023 05:41:02 GMT] "GET / HTTP/1.1" 200 15 "-" "PostmanRuntime/7.29.4"
```

- short
```sh
GET / 200 15 - 5 ms
```

### Demo
**Generic Log**
```javascript
JLogger.log("This is custom log initialized with config file.");
JLogger.error("This is an error.");
JLogger.warn("This is a warning.");
JLogger.info("This is an info.");
JLogger.cleanLog("This is a clean Log.");
JLogger.debug("This is a debug statement.");
JLogger.debugBox("This is a debug box.");

JLogger.TextColor = 'Red';
JLogger.BackgroundColor = 'White';
JLogger.StylizedMode = true;
JLogger.saveLog = true;
JLogger.log("This is updated custom log.");
```

with config file *j-logger.config.json*
```json
{
  "color": "Red",
  "backgroundColor": "Blue",
  "textFormat": ["Italic", "Bold"]
}
```

![Generic Log](https://github.com/NabinSaru/j-logger/blob/demo/images/generic_log.png)

**Stylized Log**
```javascript
JLogger.error("This is an error.");
JLogger.warn("This is a warning.");
JLogger.info("This is an info.");
JLogger.debug("This is a debug statement.");
```
![Stylized Log](https://github.com/NabinSaru/j-logger/blob/demo/images/stylized_log.png)

![Stylized middleware Log](https://github.com/NabinSaru/j-logger/blob/demo/images/stylized_middleware_log.png)

### License
This custom logger is open-source and available under the [MIT License](https://opensource.org/license/mit/). Feel free to use, modify, and share!

### Development and Publication Scripts
- npm run prepare => transpile the typescript into js
- npm run start:dev => start the transpiled code
- npm run test:build => set the build environment
- npm run test => start the test module

### Contributions
If you want to contribute, create an issues and make a PR for the issues.

### Bugs
This release is maintained by solo developer and maybe prone to bug. So, I would appreciate if you can create a bug issues.
