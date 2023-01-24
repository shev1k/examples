import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const validator = (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({
      errors: errors.mapped(),
    });

  next();
};

export default validator;
