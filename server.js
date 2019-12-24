const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema.js');

const app = express();

//if url contains /graphql - middleware here
app.use('/graphql', expressGraphQL({
    schema: schema, 
    graphiql: true
}));



app.listen(4000, () => {
    console.log('Listening')
});