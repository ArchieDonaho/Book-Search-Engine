// TODO Implement the Apollo Server and apply it to the Express server as middleware.

const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// import apollo server
const { ApolloServer } = require('apollo-server-express');
// import typeDefs & resolvers
const { typeDefs, resolvers} = require('./Schemas')
// import middleware to verify jwt
const { authMiddleware } = require('./utils/auth')

const app = express();
const PORT = process.env.PORT || 3001;

// create a new apollo server and pass in our schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create a new instance of an apollo server with our graphql schema
const startApolloServer = async ((typeDefs, resolvers) => {
  await server.start();
  // integrate our apollo server as express middleware, creating the "/graphql" endpoint
  server.applyMiddleware({ app })

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get('*', (req, res) => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`)
      console.log(`Use GraphQ: at http://localhost:${PORT}${server.graphqlPath}`)
    })
  })

})

startApolloServer(typeDefs, resolvers);


// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
