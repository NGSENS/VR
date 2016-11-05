import React from 'react';

const uniqBy = require('lodash.uniqby');
const map = require('lodash.map');

const TrackersTable = React.createClass({

	// When a tracker is clicked inside the trackers table, its details should
	// be displayed in an other component. The TrackersTable component does not
	// keep the state of the tracker that is clicked. Instead, it passes the
	// information to its parent component through a callback function.
	handleTrackerClick(tracker_key, tracker_type, e) {
		e.preventDefault(); // avoid jumping back to top of the page
		this.props.onTrackerClick(tracker_key, tracker_type);
	},

	render() {

		// Short hand variables
		const { trackers, ...other } = this.props;

		// Each row describes a tracker. To keep the right order, we loop
		// through the _sorted_ keys of the object that contains the tracker
		const rows = map(Object.keys(trackers).sort(), tracker_key => {

			// Get corresponding tracker
			const tracker = trackers[tracker_key];
			
			return (
				<tr className="tracker-element" key={ tracker_key }>
					<td className="tracker-full-domain-col">
						<a href="#" title={ tracker.full_domain }
							onClick={
								this.handleTrackerClick
									.bind(this, tracker_key, 'full_domain') }>

							{ tracker.full_domain }
						</a>
					</td>

					<td className="tracker-main-domain-col">
						<a href="#" title={ tracker.main_domain.main_domain }
							onClick={ this.handleTrackerClick
								.bind(this, tracker_key, 'main_domain') }>

							{ tracker.main_domain.main_domain }
						</a>
					</td>

					<td className="tracker-organization-col">
						<a href="#" title={ tracker.organization.name }
							onClick={ this.handleTrackerClick
								.bind(this, tracker_key, 'organization') }>

							{ tracker.organization.name }
						</a>
					</td>
				</tr>
			);
		})

		return (
			<table className="trackers-list">
				<thead>
					<tr>
						<th className="tracker-full-domain-col">
							Full domain
							<span className="col-unique-count">&nbsp;(
								{ uniqBy(Object.values(trackers), 'full_domain')
									.length }
							)</span>
						</th>
						<th className="tracker-main-domain-col">
							Main domain
							<span className="col-unique-count">&nbsp;(
								{ uniqBy(Object.values(trackers), 'main_domain')
									.length }
							)</span>
						</th>
						<th className="tracker-organization-col">
							Organization
							<span className="col-unique-count">&nbsp;(
								{ uniqBy(Object.values(trackers), 'organization')
									.length }
							)</span>
						</th>
					</tr>
				</thead>
				<tbody className="console">{ rows }</tbody>
			</table>
		);
	}
});

module.exports = TrackersTable;