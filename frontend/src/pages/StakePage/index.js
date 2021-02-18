import { connect } from 'react-redux';
import { reset } from '../../redux/actions/StakePage';
import StakePage from './StakePage';

const mapsStateToProps = (state) => ({
	pageProps: state.StakePage
});

const mapsDispatchToProps = (dispatch) => ({
	reset() {
		dispatch(reset());
	}
});

export default connect(
	mapsStateToProps,
	mapsDispatchToProps
)(StakePage);
