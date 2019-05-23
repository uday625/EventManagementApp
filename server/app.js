const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');


const app = express();

app.use (bodyParser.json());

app.use('/graphql',graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql:true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-k2ptm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
                .then(()=>{
                    console.log('Connected to Database');
                })
                .catch(err =>{
                    console.log(`Error connecting to Database - ${err.message}`);
                });

app.listen(process.env.PORT || 4000, ()=>{
    console.log(`Server started on port: ${process.env.PORT || 4000}`);
});