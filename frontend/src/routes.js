/* eslint-disable object-curly-newline */
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout';
import AgoraPage from './pages/AgoraPage';
import FaqPage from './pages/FaqPage';
import HomePage from './pages/HomePage';
import PresalePage from './pages/PresalePage';
import StakePage from './pages/StakePage';

const routes = [
	{ path: '/', exact: true, Layout: BasicLayout, Component: HomePage },
	{ path: '/presale', exact: true, Layout: BasicLayout, Component: PresalePage },
	{ path: '/agora', exact: true, Layout: BasicLayout, Component: AgoraPage },
	{ path: '/faq', exact: true, Layout: BasicLayout, Component: FaqPage },
	{ path: '/stake', exact: true, Layout: BasicLayout, Component: StakePage }
];

function Routes() {
	const location = useLocation();
	return (
		<Switch location={location}>
			{routes.map(({
				path, exact, Layout, Component
			}) => (
				<Route
					key={path}
					path={path}
					exact={exact}
					render={(props) => (
						<Layout location={location}>
							<Component {...props} />
						</Layout>
					)}
				/>
			))}
		</Switch>
	);
}

export default Routes;
