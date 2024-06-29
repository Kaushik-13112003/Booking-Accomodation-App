const bcrypt = require("bcrypt");
const hashPasswordFunc = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (err) {
    console.log(err);
  }
};

const normalPassword = async (password, comparePassword) => {
  try {
    const originalPassword = await bcrypt.compare(password, comparePassword);
    return originalPassword;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { hashPasswordFunc, normalPassword };
