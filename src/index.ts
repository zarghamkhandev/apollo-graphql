import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import * as fs from "fs";
import path from "path";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";

const app = express();

createConnection()
  .then((connection) => {
    const schemas: GraphQLSchema[] = [];
    const folders = fs.readdirSync(path.join(__dirname, "./modules"));
    folders.forEach((folder) => {
      const { resolvers } = require(`./modules/${folder}/resolvers.js`);
      const { typeDefs } = require(`./modules/${folder}/schema.js`);
      const schema = makeExecutableSchema({ typeDefs, resolvers });
      schemas.push(schema);
    });
    const server = new ApolloServer({
      schema: mergeSchemas({ schemas }),
    });

    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () => {
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      );
    });
  })
  .catch((error) => console.log(error));
