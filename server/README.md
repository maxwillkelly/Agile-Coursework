# API Server

This folder contains all the code and defintions for the GraphQL API.

## Technologies used
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [MongoDB](https://www.mongodb.com/)
- 

## create your dev `.env` file

1. create a `.env` file in the `server` directory

2. Add the following values and into the `.env` file created
    ```
    DBSTRING = MongoDB connection String
    SESSIONSECRECT = Random Session secret to generate JWT
    SPACES_ACCESS_KEY_ID = DO spaces Access key
    SPACES_SECRET_ACCESS_KEY = DO spaces Access Secret
    BUCKET_NAME = DO spaces Bucket Link
    LINK = DO spaces Base CDN link
    AWS_ENDPOINT = DO spaces Endpoint
    CERT = HTTPS cert location
    HTTPS = TRUE/FALSE to enable 
    ```

## How to configure & run

1. Create `.env` file or export enviorment variables

2. Run Server
Execute the following command to start the server

```bash
yarn dev
```