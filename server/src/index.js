/*
Runs all the code for the API
*/
// Server related imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// Apollo & GraphQL related imports
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
// Login and security imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Config
const PORT = 4000;
const SESSION_SECRECT = '1)i/S>JF}6TEd3d@}"8UaW$?O-T,J%M!L8Q]jOy/6oF*3nas2DH$6G!~$gQqrm)';

// Express App
const app = express();
// Tell express to use bodyparses and cross-origin
app.use(bodyParser.json());
app.use(cors());

const context = ({ req }) => {
    /*
  Creates the context checks for if a user if logged in or not
  Verification is done using JWT in the header of the request.
  Can not use async!
  */
    const token = req.headers.authorization || '';
    try {
        var decoded = jwt.verify(token, SESSION_SECRECT);
        if (decoded) {
            return {
                auth: true,
                user: decoded
            };
        }
    } catch (err) {
        return {
            auth: false
        };
    }
};

// The Apollo Server constructor, takes in Schema from Schema Builder and other prams
const server = new ApolloServer({
    introspection: true,
    playground: true,
    schema: schema,
    tracing: true, // Disable in Production
    debug: true, // Disable in Production
    context: context
});

//Tell Apollo to use Express.js as a middlewhere to handle requests
server.applyMiddleware({ app });

// Start Server
app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
