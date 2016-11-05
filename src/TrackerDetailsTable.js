import React from 'react';

// Components
import TrackerDetailsRow from './TrackerDetailsRow';

const TrackerDetailsTable = React.createClass({


	handleTrackerClick(tracker_type) {
		this.props.onTrackerClick(this.props.tracker.tracker_key, tracker_type);
	},

	render() {

		// SHorthand variables
		const { type, tracker, ...other } = this.props;

		// Detail content depends on type of tracker (full domain, main domain
		// or organization)
		let details_table;

		//  Prepare table
		switch (type) {
			case 'full_domain':
				details_table = (
					<table>
						<tbody>
							<TrackerDetailsRow
								onTrackerClick={this.handleTrackerClick.bind(
									this, 'full_domain') }
								prop='Full domain' val={tracker.full_domain}
							/>
							<TrackerDetailsRow
								onTrackerClick={ this.handleTrackerClick.bind(
									this, 'main_domain') }
								prop='Main domain' val={tracker.main_domain.main_domain}
							/>
							<TrackerDetailsRow
								onTrackerClick={ this.handleTrackerClick.bind(
									this, 'organization') }
								prop='Organization' val={tracker.organization.name}
							/>
						</tbody>
					</table>
				);
				break;
			case 'main_domain':
				details_table = (
					<table>
						<tbody>
							<TrackerDetailsRow
								onTrackerClick={this.handleTrackerClick.bind(
									this, 'main_domain') }
								prop='Main domain' val={tracker.main_domain.main_domain}
							/>
						</tbody>
					</table>
				);
				break;
			case 'organization':
				details_table = (
					<table>
						<tbody>
							<TrackerDetailsRow
								onTrackerClick={this.handleTrackerClick.bind(
									this, 'main_domain') }
								prop='Organization name' val={tracker.organization.name}
							/>
						</tbody>
					</table>
				);
				break;
		}

		// Render
		return (
			<div className="tracker-details-table-wrapper">
				<h3 className="section-title">Overview</h3>
				{ details_table }
			</div>
		);
	}
});

module.exports = TrackerDetailsTable;