import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import firebase from "./firebase";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Spinner from "./Spinner";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { setUser, clearUser } from "./actions";

const store = createStore(rootReducer, composeWithDevTools());

const Root = ({ history, setUser, clearUser, isLoading }) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        history.push("/");
      } else {
        history.push("/login");
        clearUser();
      }
    });
  }, [history, setUser, clearUser]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route exact path='/' component={App} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
    </Switch>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(mapStateToProps, { setUser, clearUser })(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
