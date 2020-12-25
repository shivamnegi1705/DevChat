import React from 'react';
import { Dropdown, Grid, Header, Icon } from 'semantic-ui-react';

class UserPanel extends React.Component {

    dropDownOptions = () => {
        return [
            {key:"user",text: <span>Signed in as <strong>User</strong></span>,disabled: true},
            {key:"avatar",text: <span>Change Avatar</span>},
            {key:"signout",text: <span>Sign Out</span>}
        ]
    }
    render() {
        return (
            <Grid style={{ background: '#4c3c4c'}}>
                <Grid.Column>

                    <Grid.Row style={{ padding: '1.2em', margin: 0}}>
                        {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="gg" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                    </Grid.Row>

                    {/* User Dropdown */}
                    <Header style={{ padding: '0.25em'}} as="h4" inverted>
                        <Dropdown trigger={
                            <span>User</span>
                        } options={this.dropDownOptions()}/>
                    </Header>

                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel;