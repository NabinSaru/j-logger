# Custom Logger
A custom logger utility for Node.js with configurable styles and features.

### Installation
```bash
# Clone the repository
git clone <repository_url>
cd <repository_directory>

# Install dependencies
npm install
```

### Usage
```javascript
// Import the JLogger class and other required modules
import { JLogger, requestLogger } from "./path/to/logger";

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
app.use(requestLogger("REQUEST"));

// Your routes and other middleware...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

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
