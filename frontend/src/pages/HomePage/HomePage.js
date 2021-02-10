/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PoolItem from '../../components/PoolItem';

function HomePage(props) {
	const { pageProps, reset } = props;
	const { single_asset_pools: singleAssetPools } = pageProps;

	useEffect(() => () => {
		reset();
	}, []);

	return (
		<section id="content">
			<div className="container max-w-lg md:max-w-4xl mx-auto">
				{/* 1st box */}
				<h1 className="font-sc font-bold text-xl md:text-4xl text-center py-8">Rome Pool</h1>
				<div className="h-auto p-8 bg-rf-black-100 border-1 border-rf-black-200 rounded-lg mb-16">

					{/* Top content */}
					<div className="flex justify-between mb-4">
						<div className="w-64">
							<h1 className="font-sc uppercase text-xl md:text-4xl">
								<span className="font-bold">Rome</span>
							</h1>
							<p className="font-mono text-rf-gray-100">
								Stake ROME to earn protocol fees and ROME
							</p>
						</div>
						<div className="w-80">
							<div className="flex items-center">
								<div className="text-right">
									<div className="font-sc font-bold text:xl md:text-4xl text-rf-yellow-100">1,200.43% APR</div>
									<p className="font-mono text-rf-gray-100">
										1% protocol fees + 1,199.43% rewards token
									</p>
								</div>
								<button
									type="button"
									className="btn-right-arrow ml-4"
								/>
							</div>
						</div>
					</div>

					{/* View button */}
					<Link to="/stake">
						<button
							type="button"
							className="btn btn-md btn-secondary w-full"
						>
							<div className="flex justify-between">
								<div className="font-sans font-normal">
									<span>You have 102.1234992</span>
									<strong> ROME </strong>
									<span>staked</span>
								</div>
								<span className="font-sans font-bold uppercase">View</span>
							</div>
						</button>
					</Link>

					{/* Divider */}
					<hr className="text-rf-gray-200 my-4" />

					{/* Bottom content */}
					<div className="flex justify-between">
						<div className="w-64">
							<h1 className="font-sc uppercase text-xl md:text-4xl">
								<span className="font-bold">Rome/ETH </span>
								<span>LP</span>
							</h1>
							<p className="font-mono text-rf-gray-100">
								Stake ROME to earn protocol fees and ROME
							</p>
						</div>
						<div className="w-80">
							<div className="flex items-center">
								<div className="text-right">
									<div className="font-sc font-bold text-xl md:text-4xl text-rf-yellow-100">112,200.43% APR</div>
									<p className="font-mono text-rf-gray-100">
										0.03% LP fees + 112,200.40% rewards token
									</p>
								</div>
								<button
									type="button"
									className="btn-right-arrow ml-4"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* 2nd box */}
				<h1 className="font-sc font-bold text-xl md:text-4xl text-center py-8">Single Assets Pool</h1>
				<div className="h-auto p-8 bg-rf-black-100 border-1 border-rf-black-200 rounded-lg mb-16">
					<div className="grid grid-cols-1 divide-y divide-rf-gray-100">
						{singleAssetPools.map((pool) => (
							<PoolItem
								key={`pool-${pool.name}`}
								{...pool}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

HomePage.propTypes = {
	pageProps: PropTypes.shape.isRequired,
	reset: PropTypes.func.isRequired
};

export default HomePage;
