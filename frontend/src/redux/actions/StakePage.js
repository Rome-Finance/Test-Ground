/* eslint-disable import/prefer-default-export */
import { RESET_STAKE_PAGE } from '../../constants/actionTypes';

export function reset() {
	return async (dispatch) => {
		dispatch({
			type: RESET_STAKE_PAGE
		});
	};
}
