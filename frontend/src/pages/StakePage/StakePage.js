/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function StakePage(props) {
	const { reset } = props;

	useEffect(() => () => {
		reset();
	}, []);

	return (
		<section id="content">
			<div className="container max-w-lg md:max-w-4xl mx-auto">
				<div className="font-sc font-bold text-xl md:text-4xl text-center py-8 relative">
					<Link to="/">
						<button
							type="button"
							className="btn btn-right-arrow absolute left-0 bg-rf-black-100 border-0 transform scale-x-100-1"
						/>
					</Link>
					<span>Rome Pool</span>
				</div>

				<div className="h-auto p-8 bg-rf-black-100 border-1 border-rf-black-200 rounded-lg mb-16">

					{/* Top content */}
					<div className="flex justify-between mb-8">
						<div className="w-auto">
							<h1 className="font-sc text-xl md:text-4xl">
								<span className="font-bold">Stake ROME</span>
							</h1>
							<p className="font-mono text-rf-gray-100">
								<span>Stake </span>
								<strong>ROME</strong>
								<span> to earn protocol fees and </span>
								<strong>ROME</strong>
							</p>
						</div>
						<div className="w-auto">
							<div className="flex items-center">
								<div className="text-right">
									<div className="font-sc font-bold text:xl md:text-4xl text-rf-yellow-100">1,200.43% APY</div>
									<p className="font-mono text-rf-gray-100">
										1% protocol fees + 1,199.43% rewards token
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Divider */}
					<hr className="text-rf-gray-200 my-4" />

					{/* Middle content */}
					<div className="flex flex-col items-center mb-16">
						<h1 className="font-sc font-bold text-xl md:text-5xl text-rf-yellow-100">2,110.4999</h1>
						<div className="font-sc text-base md:text-2xl text-rf-gray-100 uppercase">Staked Rome</div>
					</div>
					<div className="flex justify-around">
						<div className="flex flex-col items-center">
							<h1 className="font-sc text-xl md:text-4xl uppercase text-rf-yellow-100">15 Days</h1>
							<p className="font-sc text-rf-gray-100 uppercase">Staked Duration</p>
						</div>
						<div className="flex flex-col items-center">
							<h1 className="font-sc text-xl md:text-4xl uppercase text-rf-yellow-100">10.24</h1>
							<p className="font-sc text-rf-gray-100 uppercase">Rome earnings per day</p>
						</div>
						<div className="flex flex-col items-center">
							<h1 className="font-sc text-xl md:text-4xl uppercase text-rf-yellow-100">1.24x</h1>
							<p className="font-sc text-rf-gray-100 uppercase">Multiplier</p>
						</div>
					</div>

					{/* Divider */}
					<hr className="text-rf-gray-200 my-4" />

					{/* Bottom content */}
					<div className="flex justify-center my-8">
						<button
							type="button"
							className="btn btn-outline-gray w-44 mx-2"
						>
							Stake
						</button>
						<button
							type="button"
							className="btn btn-gray w-44 mx-2"
						>
							Unstake
						</button>
					</div>
					<p className="font-sc text-base md:text-2xl mb-8">Unstake ROME</p>
					<div className="bg-rf-green-100 border-rf-yellow-100 border-2 rounded py-6 px-4 mb-4">
						<p className="font-body font-bold text-right text-base md:text-2xl">2110.4999</p>
					</div>
					<div className="grid grid-cols-5 gap-2 mb-8">
						<div className="border-rf-gray-100 border-2 flex items-center justify-center h-10 font-body rounded">10%</div>
						<div className="border-rf-gray-100 border-2 flex items-center justify-center h-10 font-body rounded">25%</div>
						<div className="border-rf-gray-100 border-2 flex items-center justify-center h-10 font-body rounded">50%</div>
						<div className="border-rf-gray-100 border-2 flex items-center justify-center h-10 font-body rounded">75%</div>
						<div className="border-rf-gray-100 border-2 flex items-center justify-center h-10 font-body rounded">100%</div>
					</div>
					<button
						type="button"
						className="btn btn-primary w-full"
					>
						Unstake Rome
					</button>
				</div>
			</div>
		</section>
	);
}

StakePage.propTypes = {
	// pageProps: PropTypes.shape.isRequired,
	reset: PropTypes.func.isRequired
};

export default StakePage;
