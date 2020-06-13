import React from "react";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";

const UserPanel = ({ currentUser }) => {
  const dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>User</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign Out</span>
    }
  ];

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("User signed out"));
  };

  return (
    <Grid style={{ background: "#4c3c4c" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2rem", margin: 0 }}>
          {/* Main Application Header */}
          <Header inverted floated='left' as='h2'>
            <Icon name='code' />
            <Header.Content>DevChat</Header.Content>
          </Header>
        </Grid.Row>

        {/* User Dropdown */}
        <Header style={{ padding: "0.25rem" }} as='h4' inverted>
          <Dropdown trigger={<span>User</span>} options={dropdownOptions()} />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps)(UserPanel);
