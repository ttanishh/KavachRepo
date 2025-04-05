import jwt from 'jsonwebtoken';

// Secret key should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; 

/**
 * Generate a JWT token
 * @param {Object} payload - Data to encode in the token
 * @returns {String} JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

/**
 * Verify a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload if valid
 * @throws {Error} If token is invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}