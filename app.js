const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');

const app = express();

//const events =[];

app.get('/',(req,res)=>{
    res.send('Hello Express');
})

app.use('/graphql',graphqlHttp({
    schema: buildSchema(`

        type Event {
            _id : ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent (eventInput: EventInput) : Event
            
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () =>{
            //return events;
            return Event.find()
                .then(events=>{
                    return events.map(event=>{
                        return({...event._doc})
                    });
                }).catch(err=>{
                    throw err;
                });
        },
        createEvent : (args) =>{
            // const event ={
            //     _id: Math.random().toString(),
            //     title: args.evenInput.title,
            //     description: args.evenInput.description,
            //     price: +args.evenInput.price,
            //     date: args.date
            // }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            event.save()
            .then(result=>{
                console.log(result);
                return({...result._doc});
            }).catch(err=>{
                console.log(err);
                throw err;
            });
            //events.push(event);
            return event;
        }
    },
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