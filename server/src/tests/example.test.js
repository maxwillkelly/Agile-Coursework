const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server-express');
const { constructTestServer } = require('./utils');

const server = constructTestServer({});
const { query, mutate } = createTestClient(server);

it('primes query', async () => {
    //Define the GraphQL query you want to use
    const primes = gql`
        query {
            getPrimes
        }
    `;

    //Run Query against server
    const {
        data: { getPrimes }
    } = await query({ query: primes });
    expect(getPrimes).toEqual([2, 3, 5, 7, 11]);
});

it('add Muation', async () => {
    //Define the GraphQL query you want to use
    const addNum = gql`
        mutation {
            addNumbers(values: [1, 2, 3])
        }
    `;

    //Run Query against server
    const {
        data: { addNumbers }
    } = await mutate({ mutation: addNum });
    expect(addNumbers).toEqual(6);
});
