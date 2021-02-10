import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export default function configureStore(history) {
	// Init middlewares
	const middleware = [thunk, routerMiddleware(history)];

	// Init enhancers
	const enhancers = [];
	if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line no-underscore-dangle
		const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

		if (typeof devToolsExtension === 'function') {
			enhancers.push(devToolsExtension());
		}
	}
	const composedEnhancers = compose(
		applyMiddleware(...middleware),
		...enhancers
	);

	// Store creation
	const store = createStore(
		rootReducer(history),
		composedEnhancers
	);

	return store;
}
