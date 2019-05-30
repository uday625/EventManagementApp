import React, {Component,Fragment} from 'react';
import Modal from '../../components/Modal/Modal';
import { Mutation, Query} from 'react-apollo';
import AuthContext from '../../context/auth-context';
import Backdrop from '../../components/Backdrop/Backdrop';
import {CREATE_EVENT,DISPLAY_EVENTS} from '../../util/util';

import './Events.css'

class Events extends Component {

    state ={
        creating:false,
        title :'',
        description :'',
        price:0,
        date:''
    }
    
    static contextType = AuthContext;    

    startCreateEventHandler = () =>{
        this.setState({creating:true})
    }

    modalConfirmHandler =()=>{
        this.setState({creating:false});
        const title = this.state.title;
        const price = +this.state.price;
        const description = this.state.description;
        const date = this.state.date;

        if (
          title.trim().length === 0 ||
          price <= 0 ||
          date.trim().length === 0 ||
          description.trim().length === 0
        ) {
          return;
        }    
    }

    modalCancelHandler =()=>{
        this.setState({creating:false});
    }

    render() { 
      const { title, price, date, description }=this.state;
        return ( 
            <React.Fragment>
                {this.state.creating && <Backdrop/>}
                {this.state.creating &&                 
                <Mutation 
                  mutation={CREATE_EVENT} 
                  variables= {{title,price,date,description}} 
                  refetchQueries={()=>{
                    return [{
                      query:DISPLAY_EVENTS
                    }];
                  }}>
                    {(addEvent)=>(
                      <Modal title="Add Event" canCancel canConfirm 
                        onCancel={this.modalCancelHandler} 
                        onConfirm1={this.modalConfirmHandler}
                        onConfirm={()=>{
                          this.modalConfirmHandler();
                          addEvent()
                          .then()
                          .catch(error => console.log(error));
                        }}>
                        
                        <form>
                          <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" onChange ={event=>{this.setState({title:event.target.value})}} />
                          </div>
                          <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" onChange ={event=>{this.setState({price:+event.target.value})}} />
                          </div>
                          <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" onChange={event=>{this.setState({date:event.target.value})}} />
                          </div>
                          <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea
                              id="description"
                              rows="4"
                              onChange={event=>{this.setState({description:event.target.value})}}
                            />
                          </div>
                        </form>
                        

                    </Modal>


                    )}


                </Mutation>

                }
                {this.context.token && <div className="events-control">
                    <p>Share your own events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>}

                <Query query={DISPLAY_EVENTS}>
                {({data:{events},loading,error})=>{
                  if(loading|| !events){
                    return <div>Loading...</div>;
                  }
                  if(error){
                      return <div>Error...</div>;
                  }
                  return(
                    <Fragment>
                    <header className="event-header">List of Available Events</header>
                    {!events.length?(<p>No Event found</p>):  
                      <ul className="events__list">
                        {
                          events.map(event=>{
                            return(
                              <li key={event._id} className="events__list-item">{event.title}</li>
                            )
                          })
                        }
                      </ul>
                    }
                    </Fragment>
                  )    
                }}

                </Query>


            </React.Fragment>
         );
    }
}
export default Events;