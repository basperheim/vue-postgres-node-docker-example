/**
 * Ensure that a password is strong
 * @param {string} password
 * @returns {boolean}
 */
const allowPassword = (password) => {
  const tenChars = /(^.{10,})/;
  const hasTenChars = tenChars.test(password);
  if (!hasTenChars) return false;

  const hasNum = /^(?=.*[0-9])/.test(password);
  if (!hasNum) return false;

  const hasAlpha = /^(?=.*[a-zA-Z])/.test(password);
  if (!hasAlpha) return false;
  return true;
};

module.exports = { allowPassword };
