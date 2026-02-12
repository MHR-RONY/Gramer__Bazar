import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import config from '../config/index.js';

export const generateToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expire as any, // Type assertion needed due to ms package StringValue type
  };
  return jwt.sign({ id }, config.jwt.secret, options);
};

export const verifyToken = (token: string): string | JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
