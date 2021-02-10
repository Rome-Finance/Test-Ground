import React from 'react';

function Footer() {
	return (
		<>
			{/* Footer links */}
			<div className="bg-black w-full p-8">
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
					<div className="col-span-1">
						<p className="font-sc font-bold text-rf-gray-100 text-lg mb-2">Discover Rome</p>
						<p className="font-body mb-2">Vision for Rome</p>
						<p className="font-body mb-2">Agora</p>
						<p className="font-body mb-2">Guilds and Regions</p>
						<p className="font-body mb-2">Ecomonic Model</p>
					</div>
					<div className="col-span-1">
						<p className="font-sc font-bold text-rf-gray-100 text-lg mb-2">Contracts & Audits</p>
						<p className="font-body mb-2">Contract Addresses</p>
						<p className="font-body mb-2">Hacken</p>
						<p className="font-body mb-2">Certik</p>
						<p className="font-body mb-2">Certik</p>
					</div>
					<div className="col-span-1">
						<p className="font-sc font-bold text-rf-gray-100 text-lg mb-2">Be part of the Community</p>
						<p className="font-body mb-2">Medium</p>
						<p className="font-body mb-2">Discord</p>
						<p className="font-body mb-2">Telegram</p>
						<p className="font-body mb-2">Twitter</p>
					</div>
					<div className="col-span-1 md:col-span-2">
						<p className="font-sc font-bold text-rf-yellow-200 text-lg mb-2 uppercase">Risks Involved</p>
						<p className="font-sans-sc text-lg mb-2">
							Rome Finance is an experiment. Engaging into DEFI or any cryptocurrency products pose risk and loss of funds. Orci ullamcorper feugiat lobortis urna. Nisi tristique ipsum lacinia et in amet. Hac placerat amet vitae aliquam amet commodo ultricies.
						</p>
					</div>
				</div>
			</div>

			{/* Copyright */}
			<div className="bg-rf-black-200 w-full p-4">
				<div className="flex justify-center">
					<p className="font-sans-sc font-bold text-rf-yellow-200 text-lg uppercase mr-2">Rome Finance</p>
					<p className="font-sans-sc text-lg">© 2020. All rights reserved</p>
				</div>
			</div>
		</>
	);
}

export default Footer;
