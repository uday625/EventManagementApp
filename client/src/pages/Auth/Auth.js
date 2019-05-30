import React, {Component} from 'react';
import { Mutation} from 'react-apollo';
import { gql } from 'apollo-boost';
import './Auth.css'
import AuthContext from '../../context/auth-context';


const ADD_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(userInput: {email: $email, password: $password}) {
      _id
      email
    }
  }
`;

const LOGIN_USER =gql` 
    mutation SignIn($email: String! ,$password: String!){
        signIn(email:$email,password:$password){
            userId
            token
            tokenExpiration
        }
    }   
`;


class Auth extends Component{

    state = {
        email: '',
        password:'',
        isFetched: false,
        createdUser:'',
        isLogin:true,
        error:''
    }

    static contextType = AuthContext;

    submitHandler = (event)=>{
        event.preventDefault();
        const inputEmail = this.state.email;
        const inputPassword = this.state.password;

        if(inputEmail.trim().length === 0 || inputPassword.trim().length === 0){
            return;
        }

        this.setState({isFetched:true});

        console.log(`Email ${inputEmail} and password ${inputPassword}`);

        this.props.CreateUser({
            variables:{
                email: inputEmail,
                password: inputPassword,
            }
        })
        .then(({data})=>{
            console.log(`dataaa`, data);
        })
        .catch(error=>{
            console.log(error);
        });
    }

    switchModeHandler =()=>{
        this.setState(prevState=>{
            return({isLogin: !prevState.isLogin})
        })
        //console.log(this.state.isLogin);
    }

    _confirm= async ({signIn})=>{
        //console.log(`Res`,signIn);
        //console.log(`post`,this.state.isLogin);
        if(signIn.token){
            this.context.login(
                signIn.token,
                signIn.userId,
                signIn.tokenExpiration
            )
        }
        
    }

    render(){
        const {email,password,isLogin} = this.state;            
        return ( 
            <React.Fragment>
                <h1>{isLogin? "Login": "Sign Up"}</h1>
                            <div>
                                <div className="auth-container">
                                    <form className="auth-form">
                                        <div className="form-control">
                                            <label htmlFor="email"> E-mail </label>
                                            <input type="email" id="email" onChange={(event)=>{this.setState({email:event.target.value})}}></input>
                                        </div>
                                        <div className="form-control">
                                            <label htmlFor="password">Password</label>
                                            <input type="password" id="password" onChange= {(event)=>{this.setState({password:event.target.value})}}></input>
                                        </div>
                                        <div className="form-actions">
                                        <Mutation 
                                            mutation={isLogin? LOGIN_USER : ADD_USER} 
                                            variables= {{email,password}}
                                            onCompleted={data=>this._confirm(data)}
                                        >
                                        {(mutation)=>{
                                            return(
                                                <button type="submit" 
                                                    onClick={(event)=>{
                                                    event.preventDefault();
                                                    mutation()
                                                    .then((data)=>{
                                                        //console.log(data);
                                                    })
                                                    .catch();
                                                    }}>
                                                    {isLogin? 'Login':'Create Account'}
                                                </button>
                                            );
                                        }}
                                            
                                        </Mutation>
                                            <button type="button" onClick={this.switchModeHandler}>{isLogin?'need to create an account?':'already have an account?'}</button>
                                        </div>
                                    </form>        
                                </div>
                            </div>  
            </React.Fragment>
         );
    }
}
export default Auth;