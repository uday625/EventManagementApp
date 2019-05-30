import { gql } from 'apollo-boost';

const CREATE_EVENT = gql`
mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!){
  createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
    _id
    title
    description
    date
    price
    creator {
      _id
      email
    }
  }
}
`;

const DISPLAY_EVENTS= gql`{
events{
    _id
    title
    description
    price
    date
  }
}`    


export {CREATE_EVENT, DISPLAY_EVENTS}