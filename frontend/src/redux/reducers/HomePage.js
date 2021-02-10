import { RESET_HOME_PAGE } from '../../constants/actionTypes';

const initialState = {
	single_asset_pools: [{
		name: 'eth',
		earn: 'rome',
		apr: '200.00'
	}, {
		name: 'wbtc',
		earn: 'rome',
		apr: '200.00'
	}, {
		name: 'gysr',
		earn: 'rome',
		apr: '200.00'
	}, {
		name: 'rfi',
		earn: 'rome',
		apr: '200.00'
	}, {
		name: 'dai',
		earn: 'rome',
		apr: '200.00'
	}, {
		name: 'usdc',
		earn: 'rome',
		apr: '200.00'
	}, {
		name: 'usdt',
		earn: 'rome',
		apr: '200.00'
	}]
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case RESET_HOME_PAGE:
			return {
				...initialState
			};
		default:
			return state;
	}
}
