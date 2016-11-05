import React from 'react';

import TrackersTable from './TrackersTable';

const LocationDetails = function (props) {

	// SHort-hand variables
	const { location, ...other } = props;

	// If a marker is clicked by the user, we have to expand the bottom
	// banner and provide details about this tracker
	if (location) {

		return (
			<div className="location-details-wrapper">
				<div className="location-details">
					<h2 className="location-details-title">
						Domains located at { location.lat }, { location.lng }
					</h2>
					<TrackersTable { ...other }
						trackers={ location.trackers } />
				</div>
			</div>
		);	

	} else {

		return (
			<div className="location-details-wrapper">
				<div className="location-details">
					<h2 className="location-details-title">
						Click on a marker to see more details
					</h2>
				</div>
			</div>
		);
	}
};

module.exports = LocationDetails;