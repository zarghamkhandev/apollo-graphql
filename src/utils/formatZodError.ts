import { ZodError } from 'zod';

export const formatZodError = (err: ZodError) => {
  const errors: Array<{ path: string; message: string }> = [];
  err.errors.forEach((e) => {
    errors.push({
      path: e.path[0].toString(),
      message: e.message,
    });
  });
  return errors;
};
