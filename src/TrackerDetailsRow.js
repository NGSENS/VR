import React from 'react';

const TrackerDetailsRow = function(props) {

	// Shorthand variables
	const { prop, val, onTrackerClick, ...other } = props;

	return (
		<tr>
			<td className="tracker-prop-col">
				{ prop }
			</td>
			<td className="tracker-value-col">
				<a href="#" onClick={ onTrackerClick }> 
					{ val }
				</a>
			</td>
		</tr>
	);
}

module.exports = TrackerDetailsRow;