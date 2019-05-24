const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const isAuth = require('./middleware/is-auth');

const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use('/graphql',
  graphqlHttp({
    schema,
    rootValue: resolvers,
    graphiql: true
  }));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-cviiz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
.then(() => {
  const port = 3001;
  app.listen(port, () => {
    console.log(`Start server at http://localhost:${port}`);
  });
}).catch(err => {
  console.log(err);
});
