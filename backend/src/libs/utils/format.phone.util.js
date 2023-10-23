/**
 * Returns string phone number in E.164 format (required by 3rd-party APIs like Twilio).
 * @param {string} phone
 * @returns {string | undefined} cleanedNumber
 **/
const formatPhoneNumber = (phone) => {
  if (!phone || !phone.length) return;

  // Remove unwanted characters like hyphens, parenthesis, spaces, etc.
  let cleanedNumber = phone.replace(/[^\d+]/g, "");

  // Add the '+' to the beginning if it's missing
  if (cleanedNumber.charAt(0) !== "+") {
    cleanedNumber = "+" + cleanedNumber;
  }

  // Test against the regex for the E.164 format
  const regex = /^\+[1-9]\d{1,14}$/;
  if (regex.test(cleanedNumber)) {
    return cleanedNumber;
  }
};
module.exports = { formatPhoneNumber };
