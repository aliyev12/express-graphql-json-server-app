import express, { Request, Response } from 'express';
import expressGraphQL from 'express-graphql';
import { schema } from './schema/schema';

const app = express();

app.use('/graphql', expressGraphQL({
  graphiql: true,
  schema
}));

app.listen(4000, () => console.log(`Listening on port 4000`));
