import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import { connect } from 'react-redux';

class SidePanel extends React.Component {

    state = {
        user: this.props.currentUser
    }
    
    render() {
        return (
            <Menu size="large" inverted fixed="left" vertical style={{ background: '#4c3c4c',fontSize: "1.2rem" }}>
                <UserPanel />
            </Menu>
        )
    }
}

const mapStateToProps = (state) => {
    return {currentUser: state.user.currentUser};
}

export default connect(mapStateToProps)(SidePanel);