import React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { Segment, Button, Input } from 'semantic-ui-react';

import '../App.css';
import FileModal from './FileModal';
import firebase from '../../firebase';
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component {

    state = {
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        percentUploaded: 0,
        messagesRef: this.props.messagesRef,
        storageRef: firebase.storage().ref(),
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

    createMessage = (fileUrl=null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };
        if(fileUrl!==null){
            message['image'] = fileUrl;
        }
        else{
            message['content'] = this.state.message;
        }
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
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`;
        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file,metadata)
        },
        () => {
            this.state.uploadTask.on('state_changed',snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                this.props.isProgressBarVisible(percentUploaded);
                this.setState({percentUploaded});
            },
            err => {
                this.setState({errors: this.state.errors.concat(err),uploadState: 'error',uploadTask: null});
            },
            () => {
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                    this.sendFileMessage(downloadUrl, ref, pathToUpload);
                })
                .catch(err => {
                    this.setState({errors: this.state.errors.concat(err),uploadState: 'error',uploadTask: null});
                })
            })
        })
    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
        .push()
        .set(this.createMessage(fileUrl))
        .then(() => {
            this.setState({ uploadState: 'done'})
        })
        .catch(err => {
            this.setState({errors: this.state.errors.concat(err)});
        })
    }

    render() {
        const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;
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
                        disabled={uploadState==='uploading'}
                    />
                </Button.Group>
                <FileModal
                    modal = {modal}
                    closeModal = {this.closeModal}
                    uploadFile = {this.uploadFile}
                />
                <ProgressBar 
                    uploadState = {uploadState}
                    percentUploaded = {percentUploaded}
                />
            </Segment>
        )
    }
}

export default MessageForm;