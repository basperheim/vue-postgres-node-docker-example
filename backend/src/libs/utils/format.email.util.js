/**
 * Validates and returns a properly formated, trimmed, lowercase email.
 *
 * @param {string} str
 * @returns {string | undefined} email
 **/
const formatEmail = (str) => {
  if (!str || !str.length || typeof str !== "string") return;

  let email = str.toLowerCase().trim();
  email = email.replace(/\s/g, "");

  // Use RegEx to make sure the email string has the correct components
  const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  if (!emailValid || !email.length) {
    return;
  }
  return email;
};

module.exports = { formatEmail };
