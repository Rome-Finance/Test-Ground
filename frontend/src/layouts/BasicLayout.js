import PropTypes from 'prop-types';
import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';

function BasicLayout(props) {
	const { children } = props;

	return (
		<>
			<Header />
			<Hero />
			<div className="mt-16 pt-32 bg-rf-content-top bg-top bg-contain bg-no-repeat min-h-screen pb-48">
				{children}
			</div>
			<Footer />
		</>
	);
}

BasicLayout.propTypes = {
	children: PropTypes.element.isRequired
};

export default BasicLayout;
