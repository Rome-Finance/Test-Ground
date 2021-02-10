import { connect } from 'react-redux';
import { reset } from '../../redux/actions/FaqPage';
import FaqPage from './FaqPage';

const mapsStateToProps = (state) => ({
	pageProps: state.FaqPage
});

const mapsDispatchToProps = (dispatch) => ({
	reset() {
		dispatch(reset());
	}
});

export default connect(
	mapsStateToProps,
	mapsDispatchToProps
)(FaqPage);
