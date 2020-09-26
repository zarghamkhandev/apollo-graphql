import { ResolverFn } from 'apollo-server-express';
import { MiddlewareFunc } from './graphql-utils';

export const createMiddleware = (
  middlewareFunc: MiddlewareFunc,
  resolverFunc: ResolverFn
) => {
  return function (parents: any, args: any, context: any, info: any) {
    return middlewareFunc(resolverFunc, parents, args, context, info);
  };
};
