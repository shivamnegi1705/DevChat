import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';

import rootReducer from './reducers';
import { setUser, clearUser } from './actions';

import firebase from './firebase';

import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Spinner from './Spinner';


const store = createStore( rootReducer,composeWithDevTools())

class Root extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.props.setUser(user);
                this.props.history.push('/');
            }
            else{
                this.props.history.push('/login');
                this.props.clearUser();
            }
        })
    }
    
    render(){
        if(this.props.isLoading){
            return <Spinner />
        }
        return (
            <Switch>
                <Route exact path="/" component={ App } />
                <Route path="/login" component={ Login } />
                <Route path="/register" component={ Register } />
            </Switch>
        )
    }
}

const mapStateToProps = (state) => {
    return {isLoading: state.user.isLoading}
}

const RootWithAuth = withRouter(connect(mapStateToProps,{
    setUser: setUser,
    clearUser: clearUser
})(Root));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>,
    document.querySelector('#root')
);