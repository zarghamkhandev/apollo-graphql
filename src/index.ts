import 'reflect-metadata';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import express from 'express';
import { createConnection } from 'typeorm';
import * as fs from 'fs';
import path from 'path';
import { DocumentNode } from 'graphql';
import session from 'express-session';
import Redis from 'ioredis';
import { User } from './entities/User';
import { Resolvers } from './types/resolvers-types';
import cors from 'cors';
import RedisStore from 'connect-redis';

const app = express();

createConnection()
  .then((connection) => {
    app.use(
      cors({
        credentials: true,
        origin: 'http://localhost:4000',
      })
    );
    const types: DocumentNode[] = [];
    const resovs: Resolvers[] = [];
    const folders = fs.readdirSync(path.join(__dirname, './modules'));
    folders.forEach((folder) => {
      const { resolvers } = require(`./modules/${folder}/resolvers.js`);
      const { typeDefs } = require(`./modules/${folder}/schema.js`);
      types.push(typeDefs);
      resovs.push(resolvers);
    });

    const schema = makeExecutableSchema({
      typeDefs: types,
      resolvers: resovs,
    });
    const redis = new Redis();

    const redisStore = RedisStore(session);
    app.use(
      session({
        store: new redisStore({ client: redis }),
        name: 'qid',
        secret: 'cat secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        },
      })
    );
    const server = new ApolloServer({
      schema,
      context: ({ req }) => ({
        redis,
        url: req.protocol + '://' + req.get('host'),
        session: req.session,
        req: req,
      }),
    });
    server.applyMiddleware({ app });
    app.get('/confirm/:id', async (req, res) => {
      const { id } = req.params;
      const userId = await redis.get(id);
      if (userId) {
        await User.update({ id: userId?.toString() }, { confirmed: true });
        await redis.del(id);
        res.send('ok');
      } else {
        res.send('invalid');
      }
    });

    app.listen({ port: 4000 }, () => {
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      );
    });
  })
  .catch((error) => console.log(error));
