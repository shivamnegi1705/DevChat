import React from 'react';
import '../App.css';

import { Segment, Comment } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import firebase from '../../firebase';

class Messages extends React.Component {

    state = {
        messagesRef: firebase.database().ref('messages'),
        user: this.props.currentUser,
        channel: this.props.currentChannel,
        messages:[],
        messagesLoading:true
    }

    componentDidMount() {
        const { channel,user } = this.state;
        if(channel && user) {
            this.addListeners(channel.id);
        }
    }

    addListeners = (channelId) => {
        this.addMessageListener(channelId);
    }

    addMessageListener = (channelId) => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({ messages: loadedMessages, messagesLoading: false});
        })
    }

    displayMessages = (messages) => {
        // console.log(messages);
        return (
            messages.length>0 && messages.map(message => {
                return (
                    <Message 
                        key={message.timestamp}
                        message={message}
                        user={this.state.user}
                    />
                )
            })
        )
    }

    render() {
        const { messagesRef, user, channel, messages } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm messagesRef={messagesRef} currentChannel={channel} currentUser={user}/>
            </React.Fragment>
        )
    }
}

export default Messages;