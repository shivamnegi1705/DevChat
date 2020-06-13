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

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Grid textAlign='center' verticalAlign='middle' className='app'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' icon color='orange' textAlign='center'>
          <Icon name='puzzle piece' color='orange'>
            Register for DevChat
          </Icon>
        </Header>

        <Form size='large'>
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
            />
            <Button color='orange' fluid size='large'>
              Submit
            </Button>
          </Segment>
        </Form>

        <Message>
          Already a user? <Link to='/login'>Sign In</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
