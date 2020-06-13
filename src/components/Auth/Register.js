import React, { useState } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from "md5";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const usersRef = firebase.database().ref("users");

  const isFormValid = () => {
    if (isFormEmpty(formData)) {
      setErrors([...errors, { message: "Fill in all fields" }]);
      return false;
    } else if (!isPasswordValid(formData)) {
      return false;
    } else {
      return true;
    }
  };

  const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 8 || passwordConfirmation.length < 8) {
      setErrors([
        ...errors,
        { message: "Password must contain at least 8 characters" }
      ]);
      return false;
    } else if (password !== passwordConfirmation) {
      setErrors([
        ...errors,
        { message: "Passwords don't match, please try again!" }
      ]);
      return false;
    } else {
      return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const saveUser = (createdUser) => {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid()) {
      setErrors([]);
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then((createdUser) => {
          createdUser.user
            .updateProfile({
              displayName: formData.username,
              photoURL: `https://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              setLoading(false);
              saveUser(createdUser).then(() => {
                console.log("User Saved");
              });
            })
            .catch((err) => {
              console.error(err);
              setErrors([...errors, err]);
            });
        })
        .catch((err) => {
          setErrors([...errors, err]);
          setLoading(false);
        });

      setFormData({
        username: "",
        email: "",
        password: "",
        passwordConfirmation: ""
      });
    }
  };

  const displayErrors = (errors) =>
    errors.map((error, index) => <p key={index}>{error.message}</p>);

  const handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };

  return (
    <Grid textAlign='center' verticalAlign='middle' className='app'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' icon color='orange' textAlign='center'>
          <Icon name='puzzle piece' color='orange' />
          Register for DevChat
        </Header>

        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              name='username'
              icon='user'
              iconPosition='left'
              placeholder='Username'
              onChange={handleChange}
              type='text'
              value={formData.username}
            />
            <Form.Input
              fluid
              name='email'
              icon='mail'
              iconPosition='left'
              placeholder='Email Address'
              onChange={handleChange}
              type='email'
              value={formData.email}
              className={handleInputError(errors, "email")}
            />
            <Form.Input
              fluid
              name='password'
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              onChange={handleChange}
              type='password'
              value={formData.password}
              className={handleInputError(errors, "password")}
            />
            <Form.Input
              fluid
              name='passwordConfirmation'
              icon='redo'
              iconPosition='left'
              placeholder='Confirm Password'
              onChange={handleChange}
              type='password'
              value={formData.passwordConfirmation}
              className={handleInputError(errors, "password")}
            />
            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color='orange'
              fluid
              size='large'
            >
              Submit
            </Button>
          </Segment>
        </Form>

        {errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(errors)}
          </Message>
        )}

        <Message>
          Already a user? <Link to='/login'>Sign In</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
