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

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid(formData)) {
      setErrors([]);
      setLoading(true);

      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then((signedInUser) => {
          console.log("User signed in");
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setErrors([...errors, err]);
          setLoading(false);
        });

      setFormData({
        email: "",
        password: ""
      });
    }
  };

  const isFormValid = ({ email, password }) => email && password;

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
        <Header as='h1' icon color='violet' textAlign='center'>
          <Icon name='code branch' color='violet' />
          Login to DevChat
        </Header>

        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
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
            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color='violet'
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
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
