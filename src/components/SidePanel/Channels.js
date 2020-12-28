import React from 'react';
import { connect } from 'react-redux';

import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

import firebase from '../../firebase';
import { setCurrentChannel } from '../../actions';

class Channels extends React.Component {

    state = {
        activeChannel:'',
        user: this.props.currentUser,
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        firstLoad: true
    }

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', (snap) => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels}, () => this.setFirstChannel());
        })
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    setFirstChannel = () => {
        if(this.state.firstLoad && this.state.channels.length > 0){
            const firstChannel = this.state.channels[0];
            this.props.setCurrentChannel(firstChannel);
            this.setState({firstLoad: false});
            this.setActiveChannel(firstChannel);
        }
    }

    addChannel = () => {

        const { channelsRef, channelName, channelDetails, user } = this.state;
        
        // gives unique key
        const key = channelsRef.push().key;
        
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
            this.setState({channelName:'', channelDetails: ''});
            this.closeModal();
            console.log('channel added');
        })
        .catch( err => {
            console.log(err);
        })

    }

    isFormValid = ({ channelName, channelDetails}) => {
        return channelName && channelDetails;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.isFormValid(this.state)){
            this.addChannel();
        }
    }

    closeModal = () => {
        this.setState({modal:false});
    }

    openModal = () => {
        this.setState({modal:true});
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    changeChannel = (channel) => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    }

    setActiveChannel = (channel) => {
        this.setState({activeChannel: channel.id})
    }

    displayChannels = (channels) => {
        return (
            channels.length >0 && channels.map(channel => {
                return (
                    <Menu.Item
                        key={channel.id}
                        onClick={() => this.changeChannel(channel)}
                        name={channel.name}
                        style={{opacity: 0.9}}
                        active={channel.id===this.state.activeChannel}
                    >
                        # {channel.name}
                    </Menu.Item>
                )
            })
        )
    }

    render() {
        const { channels, modal } = this.state;
        return (
            <React.Fragment>
                <Menu.Menu>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>{" "}
                        ({ channels.length }) <Icon name="add" onClick={this.openModal}/>
                    </Menu.Item>
                    {/* Channels */}
                    {this.displayChannels(channels)}
                </Menu.Menu>

                {/* Add Channel Modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input 
                                    fluid
                                    label="Name of channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input 
                                    fluid
                                    label="About the channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" /> Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {currentUser: state.user.currentUser};
}

export default connect(mapStateToProps,{setCurrentChannel})(Channels);