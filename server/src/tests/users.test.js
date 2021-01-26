const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server-express');
const { constructTestServer } = require('./utils');
const database = require('../database');

// Start Server
const server = constructTestServer({
    auth: true,
    user: {
        ID: '600ef0b7ed2d27374082a218',
        Level: '2',
        Email: 'test@vlee.me.uk',
    }
});
const { query, mutate } = createTestClient(server)


beforeAll(async (done) => {
    await database.connectToServer();
    done()
});

afterAll(() => {
    database.closeDb();
});

it('login user query', async () => {
    //Define the GraphQL query you want to use
    const GETLOGINUSER = gql`
        query {
            getLoginUser{
                id
                firstName
                lastName
                level
                permission
                email
            }
        }
    `;

    //Run Query against server
    const {
        data: { getLoginUser }
    } = await query({ query: GETLOGINUSER });
    expect(getLoginUser).toEqual({
        "email": "test@vlee.me.uk",
        "firstName": "Joe",
        "id": "600ef0b7ed2d27374082a218",
        "lastName": "Blogs",
        "level": 2,
        "permission": "Admin"
    });
});

it('query all users in system', async () => {
    //Define the GraphQL query you want to use
    const GETUSERS = gql`
        query {
            getUsers{
                id
                firstName
                lastName
                level
                permission
                email
            }
        }
    `;

    //Run Query against server
    const {
        data: { getUsers }
    } = await query({ query: GETUSERS });
    expect(getUsers).toContainEqual({
        "email": "test@vlee.me.uk",
        "firstName": "Joe",
        "id": "600ef0b7ed2d27374082a218",
        "lastName": "Blogs",
        "level": 2,
        "permission": "Admin"
    });
});

it('query all users in system', async () => {
    //Define the GraphQL query you want to use
    const GETUSERS = gql`
        query {
            getUsers{
                id
                firstName
                lastName
                level
                permission
                email
            }
        }
    `;

    //Run Query against server
    const {
        data: { getUsers }
    } = await query({ query: GETUSERS });
    expect(getUsers).toContainEqual({
        "email": "test@vlee.me.uk",
        "firstName": "Joe",
        "id": "600ef0b7ed2d27374082a218",
        "lastName": "Blogs",
        "level": 2,
        "permission": "Admin"
    });
});

it('Add user to system', async () => {
    //Define the GraphQL query you want to use
    const UPDATEUSER = gql`
        mutation($id: ID!
            $password: String
            ){
                updateUser(
                id: $id
                password: $password
            ){
                id
                firstName
                lastName
                level
                permission
                email
            }
        }
    `;

    //Run Query against server
    const{ 
        data: {updateUser}
    } = await mutate({
        mutation: UPDATEUSER, 
        variables: { id: "600ef0b7ed2d27374082a218", password: "testing" } 
    });
    expect(updateUser).toEqual({
        "email": "test@vlee.me.uk",
        "firstName": "Joe",
        "id": "600ef0b7ed2d27374082a218",
        "lastName": "Blogs",
        "level": 2,
        "permission": "Admin"
    });
});