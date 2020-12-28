import React from 'react';
import '../App.css';

import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

import firebase from '../../firebase';

class Messages extends React.Component {

    state = {
        messagesRef: firebase.database().ref('messages')
    }

    render() {
        const { messagesRef } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">

                    </Comment.Group>
                </Segment>

                <MessageForm messagesRef={messagesRef} />
            </React.Fragment>
        )
    }
}

export default Messages;