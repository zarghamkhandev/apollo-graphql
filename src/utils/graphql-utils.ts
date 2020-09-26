import { ResolverFn } from 'apollo-server-express';

export type MiddlewareFunc = (
  resolver: ResolverFn,
  parent: any,
  args: any,
  context: any,
  info: any
) => any;
