const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

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

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent (eventInput: EventInput) : Event
            createUser (userInput:UserInput) : User
            
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
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5ce5ef8b777a8d45cddf97a5'
            })
            let createdEvent;
            return event.save()
            .then(result=>{
                createdEvent = {...result._doc}
                return User.findById('5ce5ef8b777a8d45cddf97a5')   
            })
            .then(user =>{
                if(!user){
                    throw new Error ('User not found.');
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then (result =>{
                return createdEvent
            })
            .catch(err=>{
                console.log(err);
                throw err;
            });
        },
        createUser: args =>{
            return User.findOne({email:args.userInput.email})
            .then(user =>{
                if(user){
                    throw new Error ('User exists already');
                }
                return bcrypt.hash(args.userInput.password,12);
            })
            .then(hashedPassword =>{
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .then( result =>{
                return {...result._doc, password:null}
            })
            .catch(err => {
                throw err;
            });                    
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