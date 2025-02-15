import { NextFunction, Request, Response } from "express";

// Async handler for express routes to handle async functions it is a wrapper function that wraps the async function in a promise and catches any errors
const asyncHandler = (requestHandler: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
