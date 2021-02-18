/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';
import React from 'react';

function PoolItem(props) {
	const { name, earn, apr } = props;

	return (
		<div className="flex justify-between py-4">
			<div>
				<h1 className="font-sc uppercase text-xl md:text-4xl">
					<span className="font-bold uppercase">{name}</span>
				</h1>
				<p className="font-mono text-rf-gray-100 text-base">
					<span>Stake</span>
					<span className="font-bold uppercase">{` ${name} `}</span>
					<span>to earn</span>
					<span className="font-bold uppercase">{` ${earn}`}</span>
				</p>
			</div>

			<div>
				<div className="flex items-center">
					<div className="text-right">
						<div className="font-sc font-bold text:xl md:text-4xl text-rf-yellow-100">{`${apr}% APR`}</div>
						<p className="font-mono text-rf-gray-100 text-base">{`${apr}% rewards token`}</p>
					</div>
					<button
						type="button"
						className="btn-right-arrow ml-4"
					/>
				</div>
			</div>
		</div>
	);
}

PoolItem.propTypes = {
	name: PropTypes.string.isRequired,
	earn: PropTypes.string.isRequired,
	apr: PropTypes.string.isRequired
};

export default PoolItem;
