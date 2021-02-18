import React from 'react';

function Hero() {
	return (
		<div className="bg-rf-hero bg-no-repeat bg-cover h-auto mt-16">
			<div className="container max-w-lg md:max-w-4xl mx-auto py-24 md:py-32 relative">
				{/* Banner */}
				<div className="bg-black bg-opacity-80 rounded-lg p-4 md:p-8">
					<p className="font-sc text-xl md:text-4xl">
						<span className="font-bold uppercase">Rome: </span>
						<span>Next generation yield farming</span>
					</p>
					<p className="font-mono text-rf-gray-100 text-base md:text-2xl mt-4 md:mt-8 mb-3 md:mb-6">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae sit sit mi feugiat nisl, fringilla. Orci ullamcorper feugiat lobortis urna. Nisi tristique ipsum lacinia et in amet. Hac placerat amet vitae aliquam amet commodo ultricies.
					</p>
					<button
						type="button"
						className="btn btn-outline-primary"
					>
						Learn more
					</button>
				</div>

				{/* CTAs */}
				<div className="absolute -bottom-36 w-full">
					<div className="grid grid-cols-4 md:grid-cols-5 gap-4">
						<div className="col-span-2 md:col-span-3 h-auto p-4 bg-gradient-to-b from-rf-red-100 to-rf-black-100 border-2 border-rf-yellow-200 rounded-lg">
							<div className="flex flex-col space-y-6">
								<div className="flex justify-between">
									<div className="font-sans-sc uppercase">Presale round 1 is ongoing</div>
									<div className="font-sans-sc uppercase">
										<span>Ends in </span>
										<strong>2 days</strong>
									</div>
								</div>
								<div className="flex justify-between">
									<div className="font-sc font-bold uppercase text:lg md:text-4xl text-yellow-400">Bronze</div>
									<div className="font-sc font-bold text:lg md:text-4xl text-yellow-400">420 per 1 ETH</div>
								</div>
								<button
									type="button"
									className="btn btn-primary w-full"
								>
									Buy bronze now
								</button>
							</div>
						</div>
						<div className="col-span-2 h-auto p-4 bg-gradient-to-b from-rf-black-200 to-rf-black-300 border-2 border-rf-black-100 rounded-lg">
							<div className="flex flex-col space-y-6">
								<div className="flex">
									<div className="font-sans-sc">Current Price</div>
								</div>
								<div className="flex justify-between">
									<div className="font-sc font-bold uppercase text:lg md:text-4xl">Rome</div>
									<div className="font-sc font-bold text:lg md:text-4xl text-yellow-600">$ 420.69</div>
								</div>
								<button
									type="button"
									className="btn btn-outline-primary w-full"
								>
									Buy Rome
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Hero;
