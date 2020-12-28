import React from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';

class MessageForm extends React.Component { 

    state = {
        message: '',
        messagesRef: this.props.messagesRef,
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: []
    }

    static getDerivedStateFromProps(nextProps,state){
        return {
            ...state,messageRef:nextProps.messagesRef, channel: nextProps.currentChannel, user: nextProps.currentUser
        };
    }
    

    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value});
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        };
        return message;
    }

    sendMessage = () => {
        const { messagesRef, message,channel } = this.state;
        if(message){
            this.setState({loading: true});
            messagesRef
            .child(channel.id)
            .push()
            .set(this.createMessage())
            .then(() => {
                this.setState({loading: false, message: ''});
            })
            .catch((err) => {
                console.log(err);
                this.setState({loading: false, errors: this.state.errors.concat(err)});
            })
        }
        else{
            this.setState({
                errors:this.state.errors.concat({message: 'Add a message'})
            })
        }
    }

    render() {
        const { errors } = this.state;
        return (
            <Segment className="message__form">
                <Input fluid name="message" style={{marginBottom: '0.7em'}} label={<Button icon="add" />} labelPosition="left" placeholder="Write your message" onChange={this.handleChange} className={
                    errors.some(error => error.message.includes('message')) ?'error' : ''
                }/>

                <Button.Group>
                    <Button
                        onClick={this.sendMessage}
                        color="orange"
                        content="Add reply"
                        labelPosition="left"
                        icon="edit"
                    />

                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        )
    }
}

const mapStateToProps = (state) => {
    return {currentChannel: state.channel.currentChannel,currentUser: state.user.currentUser};
}

export default connect(mapStateToProps)(MessageForm);