import { connect } from 'react-redux';
import { reset } from '../../redux/actions/AgoraPage';
import AgoraPage from './AgoraPage';

const mapsStateToProps = (state) => ({
	pageProps: state.AgoraPage
});

const mapsDispatchToProps = (dispatch) => ({
	reset() {
		dispatch(reset());
	}
});

export default connect(
	mapsStateToProps,
	mapsDispatchToProps
)(AgoraPage);
