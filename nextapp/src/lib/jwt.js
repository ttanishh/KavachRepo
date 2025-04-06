import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kavach-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

/**
 * Generate a JWT token for user authentication
 * 
 * @param {Object} payload - Data to encode in the token
 * @returns {Promise<string>} - JWT token
 */
export const generateToken = async (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

/**
 * Verify and decode a JWT token
 * 
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object>} - Decoded token payload
 */
export const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};