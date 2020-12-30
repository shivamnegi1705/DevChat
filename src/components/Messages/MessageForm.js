import React from 'react';
import '../App.css';
import FileModal from './FileModal';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';

class MessageForm extends React.Component {

    state = {
        message: '',
        messagesRef: this.props.messagesRef,
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false
    }

    openModal = () => this.setState({modal: true});

    closeModal = () => this.setState({modal: false});

    componentDidMount() {
        const { channel, user} = this.state;
        if(channel && user){
            this.addListeners(channel.id)
        }
    }

    addListeners = (channelId) => {
        this.addMessageListener(channelId);
    }

    addMessageListener = (channelId) => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
        })
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
        const { messagesRef, message, channel } = this.state;
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

    uploadFile = (file, metadata) => {
        console.log(file,metadata);
    }

    render() {
        const { errors, message, loading, modal } = this.state;
        return (
            <Segment className="message__form">
                <Input 
                    fluid name="message"
                    style={{marginBottom: '0.7em'}} 
                    label={<Button icon="add" />} 
                    labelPosition="left" 
                    placeholder="Write your message" 
                    onChange={this.handleChange} 
                    className={errors.some(error => error.message.includes('message')) ?'error' : ''}
                    value ={message}    
                />

                <Button.Group icon widths="2">
                    {/* Add reply Button */}
                    <Button
                        onClick={this.sendMessage}
                        color="orange"
                        content="Add reply"
                        labelPosition="left"
                        icon="edit"
                        disabled={loading}
                    />

                    {/* Upload Media Button */}
                    <Button
                        color="teal"
                        onClick={this.openModal}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                    <FileModal
                        modal = {modal}
                        closeModal = {this.closeModal}
                        uploadFile = {this.uploadFile}
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default MessageForm;