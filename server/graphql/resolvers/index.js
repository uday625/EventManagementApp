const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const bcrypt = require('bcryptjs');
const { dateToString } = require('../../helpers/date');


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
const getEvents = async eventids =>{
    try{
     const events = await Event.find({_id:{$in:eventids}});
         events.map(event=>{
            return {
                ...event._doc,
                date: dateToString(event._doc.date),
                creator: getUser.bind(this,event.creator)
            }
        });
        return events;
    }
    catch(err) {
        throw err;
    }
}
const getSingleEvent = eventid =>{
    return Event.findById(eventid).then(event=>{
        return {
            ...event._doc,
            creator: getUser.bind(this, event._doc.creator)
        }
    }).catch(err=>{
        throw err;
    })
};

module.exports = {
    events: () =>{
        return Event.find()
            .then(events=>{
                return events.map(event=>{
                    return({
                        ...event._doc, 
                        date: dateToString(event._doc.date),
                        creator: getUser.bind(this, event._doc.creator)
                    });
                });
            }).catch(err=>{
                throw err;
            });
    },
    bookings: async () =>{
        try{
            const bookings = await Booking.find();
            return bookings.map(booking=>{
                return {
                    ...booking._doc,
                    user: getUser.bind(this, booking._doc.user),
                    event: getSingleEvent.bind(this,booking._doc.event),
                    createdAt: dateToString(booking._doc.createdAt),
                    updatedAt: dateToString(booking._doc.updatedAt)
                }
            })
        }catch(err){
            throw err
        }
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
                date: dateToString(event._doc.date),
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
    },
    createBooking : args =>{
        return Event.findOne({_id:args.eventId})
        .then(fetchedEvent =>{
            if(!fetchedEvent){
                throw new Error ('Event not found.')
            }
            const booking = new Booking ({
                user: '5ce5ef8b777a8d45cddf97a5',
                event: fetchedEvent
            })
            return booking.save()
        })
        .then( result =>{
            return {
                ...result._doc,
                user: getUser.bind(this, result._doc.user),
                event: getSingleEvent.bind(this,result._doc.event),
                createdAt: dateToString(result._doc.createdAt),
                updatedAt: dateToString(result._doc.updatedAt)                
            }
        })
        .catch(err =>{
            throw err;
        });

    },
    cancelBooking : args =>{
        let event;
        return Booking.findById(args.bookingId).populate('event')
        .then( fetchedBooking =>{
             event ={
                ...fetchedBooking.event._doc,
                creator: getUser.bind (this, fetchedBooking.event._doc.creator)
            }
            return Booking.deleteOne({_id: args.bookingId})
        })
        .then( result =>{
            console.log (result);
            return event;
        })            
        .catch(err =>{
            throw err;
        })
    }
}