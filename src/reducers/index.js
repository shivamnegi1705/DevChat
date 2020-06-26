import { combineReducers } from "redux";
import * as actionTypes from '../actions/types';

const initialUserState = {
	currentUser: null,
	isLoading: true
}

const initialChannelState = {
	currentChannel: null,
	isLoading: true,
	isPrivateChannel: false
}

const user_reducer = (state = initialUserState, action) => {
	switch (action.type) {
		case actionTypes.SET_USER:
			return {
				currentUser: action.payload.currentUser,
				isLoading: false
			}

		case actionTypes.CLEAR_USER:
			return {
				...initialUserState,
				isLoading: false
			}

		default:
			return state;
	}
} // user_reducer

const channel_reducer = (state = initialChannelState, action) => {
	switch (action.type) {
		case actionTypes.SET_CURRENT_CHANNEL:
			return {
				currentChannel: action.payload.currentChannel,
				isLoading: false
			}
		case actionTypes.SET_PRIVATE_CHANNEL:
			return {
				...state,
				isPrivateChannel: action.payload.isPrivateChannel
			}
		default:
		return state;
	}
} // channel_reducer

const rootReducer = combineReducers({
	user: user_reducer,
	channel: channel_reducer
});

export default rootReducer;
