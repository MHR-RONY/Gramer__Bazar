import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';
import { ErrorResponse } from './errorHandler.js';
import config from '../config/index.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ErrorResponse('User not found', 404));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user?.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
