/**
 * Logs an error message along with the file path and function name in red font color.
 * @param {Error} err - The error object to log.
 * @param {string} filename - The file name to extract the relative path from.
 */
const redErrorlogging = (err, filename) => {
  const stack = {};
  const filePath = filename.substring(filename.indexOf("src"));
  if (err && err.message) {
    Error.captureStackTrace(stack, redErrorlogging);
    const stackLines = stack.stack.split("\n");
    const functionName = stackLines[1].trim();
    const errorLocation = functionName.split("(")[0].trim();

    console.error(`\x1b[31m${filePath} ${errorLocation}() Error =>\x1b[37m`);
    console.error(err);
  } else {
    console.error(`\x1b[31m${filePath} => ${err}\x1b[37m`);
  }
};

/**
 * Logs a warning message along with the file path in yellow font color.
 * @param {string} message - The warning message to log.
 * @param {string} filename - The file name to extract the relative path from.
 */
const yellowWarnLogging = (message, filename = "") => {
  const filePath = filename ? filename.substring(filename.indexOf("src")) + " " : "";
  console.log(`\x1b[33m${filePath}Warning => ${message}\x1b[37m`);
};

/**
 * Obscures logging of sensitive data
 * @param {string} message
 * @returns {string}
 */
const obscuredLogging = (message, label = undefined) => {
  let msg = "";
  if (message && message.length >= 10) {
    const obscuredStart = message.substring(0, 4);
    const obscuredEnd = message.substring(message.length - 4, message.length);
    const repeat = "*".repeat(message.length - 8);
    msg = obscuredStart + repeat + obscuredEnd;
    if (label) {
      console.warn(`\x1b[33m${label}: ${msg}\x1b[37m`);
    } else {
      console.warn(`\x1b[33m${msg}\x1b[37m`);
    }
  } else {
    if (label) {
      console.warn(`\x1b[33m${label}: ${message}\x1b[37m`);
    } else {
      console.warn(`\x1b[33m${message}\x1b[37m`);
    }
    msg = message;
  }
  return msg;
};

module.exports = { redErrorlogging, yellowWarnLogging, obscuredLogging };
