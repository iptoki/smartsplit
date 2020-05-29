const Config = require("../config");
const JWT = require("jsonwebtoken");

/**
 * Creates a new JWT token using a secret derived from the type and
 * the system JWT secret.
 */
module.exports.create = function (type, data, expires) {
  return JWT.sign(data, type + Config.jwt_secret, { expiresIn: expires });
};

/**
 * Decodes a JWT token of a given type using a secret derived from the type and
 * the system JWT secret.
 */
module.exports.decode = function (type, token) {
  try {
    return JWT.verify(token, type + Config.jwt_secret);
  } catch (e) {
    return null;
  }
};
