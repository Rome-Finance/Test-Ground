import { RESET_FAQ_PAGE } from '../../constants/actionTypes';

const initialState = {};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case RESET_FAQ_PAGE:
			return {
				...initialState
			};
		default:
			return state;
	}
}
