import { connect } from 'react-redux';
import { reset } from '../../redux/actions/HomePage';
import HomePage from './HomePage';

const mapsStateToProps = (state) => ({
	pageProps: state.HomePage
});

const mapsDispatchToProps = (dispatch) => ({
	reset() {
		dispatch(reset());
	}
});

export default connect(
	mapsStateToProps,
	mapsDispatchToProps
)(HomePage);
