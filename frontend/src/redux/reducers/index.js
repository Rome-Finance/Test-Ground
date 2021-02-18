import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import AgoraPage from './AgoraPage';
import FaqPage from './FaqPage';
import HomePage from './HomePage';
import PresalePage from './PresalePage';
import StakePage from './StakePage';

export default (history) => combineReducers({
	router: connectRouter(history),
	HomePage,
	PresalePage,
	AgoraPage,
	FaqPage,
	StakePage
});
