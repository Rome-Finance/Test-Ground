/* eslint-disable no-console */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

function FaqPage(props) {
	useEffect(() => () => {
		props.reset();
	}, []);

	return (
		<section id="content">
			<div className="container max-w-lg md:max-w-4xl mx-auto">
				<h1 className="font-sc font-bold text-xl md:text-4xl text-center py-8">FAQ</h1>
			</div>
		</section>
	);
}

FaqPage.propTypes = {
	// pageProps: PropTypes.shape.isRequired,
	reset: PropTypes.func.isRequired
};

export default FaqPage;
