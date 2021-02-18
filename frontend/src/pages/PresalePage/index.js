import { connect } from 'react-redux';
import { reset } from '../../redux/actions/PresalePage';
import PresalePage from './PresalePage';

const mapsStateToProps = (state) => ({
	pageProps: state.PresalePage
});

const mapsDispatchToProps = (dispatch) => ({
	reset() {
		dispatch(reset());
	}
});

export default connect(
	mapsStateToProps,
	mapsDispatchToProps
)(PresalePage);
