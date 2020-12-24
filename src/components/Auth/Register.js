import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import '../App.css';
import firebase from '../../firebase';
import md5 from 'md5';

class Register extends React.Component {
    
    // state to store user form data.
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    }

    // to capture value of user data.
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    // to check if any field is empty or not.
    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    // to check if password and passwordConfirmation are same or not.
    isPasswordValid = ({ password, passwordConfirmation}) => {
        if( password.length < 6 || passwordConfirmation.length < 6){
            return false;
        }
        else if( password!==passwordConfirmation ){
            return false;
        }
        else{
            return true;
        }
    }

    // helper to display errors
    displayErrors = (errors) => errors.map((error,index) => <p key={index}>{error.message}</p>)
    
    // helper function to highlight error field.
    handleInputError = (errors,inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '' ;
    }

    // to check whether form is valid or not.
    isFormValid = () => {
        let errors = [];
        let error;

        if(this.isFormEmpty(this.state)){
            // if any field is empty
            error = {message: 'Fill in all fields'};
            this.setState({errors: errors.concat(error)});
            return false;
        }
        if(!this.isPasswordValid(this.state)){
            // passwords do not match
            error = {message: 'Password is invalid'};
            this.setState({errors: errors.concat(error)});
            return false;
        }
        else{
            return true;
        }
    }

    saveUser = (createdUser) => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: this.state.username,
            avatar: createdUser.user.photoURL
        });
    }

    // function to handle form submit.
    handleSubmit = (event) => {
        event.preventDefault();
        if(this.isFormValid()){
            this.setState({loading: true, errors:[]});
            // Creating user with Email and Password using firebase.
            firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( createdUser => {
                // setting displayName and a random photoURL from gravatar
                // md5 use to hash unique value
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                })
                .then(() => {
                    this.saveUser(createdUser).then(() => {
                        console.log('user saved!')
                    })
                })
                .catch((err) => {
                    this.setState({errors: this.state.errors.concat(err), loading: false});
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({loading:false, errors:this.state.errors.concat(err)})
            })
        }
    }

    render() {
        const {username, email, password, passwordConfirmation, errors, loading} = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    
                    <Header as="h1" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register For DevChat
                    </Header>

                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>

                            <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="username" onChange={this.handleChange} type="text" value={username}/>

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" onChange={this.handleChange} type="email" value={email} className={this.handleInputError(errors,'email')} />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="password" onChange={this.handleChange} type="password" value={password} className={this.handleInputError(errors,'password')}/>

                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation" onChange={this.handleChange} type="password" value={passwordConfirmation} className={this.handleInputError(errors,'password')}/>

                            <Button disabled={loading} className={loading ?'loading': ''} color="orange" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length>0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a user?<Link to="/login">Login</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;