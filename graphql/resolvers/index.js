const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');


const getUser = userId =>{
    return User.findById(userId)
    .then(user=>{
        return {
            ...user._doc,
            createdEvents: getEvents.bind(this, user._doc.createdEvents)
        }
    })
    .catch(err =>{
        throw err;
    });
};

const getEvents = eventids =>{
    return Event.find({_id:{$in:eventids}})
    .then(events =>{
        return events.map(event=>{
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: getUser.bind(this,event.creator)
            }
        })
    })
    .catch(err =>{
        throw err;
    });
}


module.exports = {
    events: () =>{
        //return events;
        return Event.find()
            .then(events=>{
                return events.map(event=>{
                    return({
                        ...event._doc, 
                        date: new Date(event._doc.date).toISOString(),
                        creator: getUser.bind(this, event._doc.creator)
                    });
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
            createdEvent = {
                ...result._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: getUser.bind(this,result._doc.creator)
            }
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
}