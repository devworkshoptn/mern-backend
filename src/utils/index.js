const bcrypt = require("bcrypt");

const encryptPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(new Error("Error while generating password"));
      }
      resolve(hash);
    });
  });

const verifyPassword = (password, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        reject(new Error("Error while generating password"));
      }
      resolve(result);
    });
  });

module.exports = {
  encryptPassword,
  verifyPassword,
};
