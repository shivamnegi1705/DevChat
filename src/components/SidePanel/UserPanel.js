import React from 'react';
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react';
import firebase from '../../firebase';

class UserPanel extends React.Component {

    state = {
        user: this.props.currentUser
    }

    handleSignOut = () => {
        firebase
        .auth()
        .signOut()
        .then(() => {
            console.log('signed out!');
        })
    }
    
    dropDownOptions = () => {
        return [
            {key:"user",text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,disabled: true},
            {key:"avatar",text: <span>Change Avatar</span>},
            {key:"signout",text: <span onClick={this.handleSignOut}>Sign Out</span>}
        ]
    }
    
    render() {
        const { user } = this.state;
        return (
            <Grid style={{ background: '#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0}}>
                        
                        {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="gg" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                        
                        {/* User Dropdown */}
                        <Header style={{ padding: '0.25em'}} as="h4" inverted>
                            <Dropdown 
                                trigger={
                                    <span>
                                        <Image src = {user.photoURL} spaced="right" avatar/>
                                        {user.displayName}
                                    </span>
                                } 
                                options={this.dropDownOptions()}
                            />
                        </Header>

                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel;