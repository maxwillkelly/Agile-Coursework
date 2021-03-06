/*
Runs all the code for the API
*/
//Env setup
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

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
const database = require('./database');
// Deals with HTTPS
const fs = require('fs')
const https = require('https')


// Config
const PORT = 4000;
const SESSION_SECRECT = process.env.SESSIONSECRECT;

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
}

// Login page
app.post('/login', async (req, res) => {
    var db = database.getDb();
    /*
    This function handles the Staff login procedure
    */
    // Check if body has email and password
    if (('email' in req.body) && ('password' in req.body)) {
        const { email, password } = req.body
        const loginEntry = await db.collection('users').findOne({ "email": email })
        if (loginEntry) {
            // Check bcrypt password
            const match = await bcrypt.compare(password, loginEntry.password)
            if (match) {
                // Create token and send back
                const token = jwt.sign({
                    ID: loginEntry._id,
                    Level: loginEntry.level,
                    Email: loginEntry.email
                }, SESSION_SECRECT, { expiresIn: '8h' });
                // Get the time token will expire for user
                var expire = new Date();
                expire.setHours(expire.getHours() + 8);
                // Send token
                res.send({
                    success: true,
                    token,
                    id: loginEntry._id,
                    level: loginEntry.level,
                    expire
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: 'Incorrect credentials',
                })
            }
        } else {
            res.status(401).send({
                success: false,
                message: `Incorrect credentials`,
            })
        }
    } else {
        res.status(404).send({
            success: false,
            message: 'No / Incomplete Credentials Provided',
        })
    }
})

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

database.connectToServer()

// Start Server
app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});

// Only launch the HTTPS server if we are on the deployment system
if (process.env.HTTPS == "TRUE") {
    // Start server with HTTPS
    https
        .createServer(
            {
                key: fs.readFileSync(`${process.env.CERT}/privkey.pem`),
                cert: fs.readFileSync(`${process.env.CERT}/cert.pem`),
                ca: fs.readFileSync(`${process.env.CERT}/chain.pem`),
            },
            app
        )
        .listen(443, () => {
            console.log(`🚀 Server ready at https://localhost${server.graphqlPath}`)
        })
}