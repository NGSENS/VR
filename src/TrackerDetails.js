import React from 'react';

// Utils
const filter = require('lodash.filter');

// Components
import TrackerDetailsTable from './TrackerDetailsTable';
import TrackerDetailsSources from './TrackerDetailsSources';
import $ from 'jquery';
import map from 'lodash.map';

const TrackerDetails = React.createClass({

	getInitialState() {
		return {
			source_keys: []
		}
	},

	componentDidMount() {
		this.loadDetails();
	},

	componentWillReceiveProps(nextProps) {
		this.loadDetails(nextProps);
	},

	loadDetails(props) {
		props = props || this.props;

		let api_endpoint;
		if (props.type == 'main_domain') {
			api_endpoint = props.tracker.main_domain.api_endpoint;
		} else if (props.type == 'organization') {
			api_endpoint = props.tracker.organization.api_endpoint;
		}

		if (api_endpoint) {
			this.serverRequest = $.get(api_endpoint, result => {
				this.setState({
					source_keys: JSON.parse(result),
				});
			});
		}
	},

	render() {

		// Shorthand variables
		const { tracker, type, sources, ...other } = this.props;

		// Get sources where this tracker has been seen on
		let seen_on = [];
		switch(type) {
			case 'main_domain':
			case 'organization':
			seen_on = map(this.state.source_keys, source_key => sources[source_key]);
			break;

			default:
			seen_on = tracker.source_keys.map(source_key => sources[source_key]);
		}

		// Separate into pages, imported scans and sample datasets
		const pages_seen_on = filter(seen_on, source => source.type == 0);
		const scans_seen_on = filter(seen_on, source => source.type == 1);
		const samples_seen_on = filter(seen_on, source => source.type == 2);

		return (
			<div className="tracker-details">
				<section className="tracker-details-section">
					<TrackerDetailsTable {...other} type={ type }
						tracker={ tracker } />
				</section>

				<section className="tracker-details-section">
					<TrackerDetailsSources type="scanned web page(s)"
						sources={ pages_seen_on } />
				</section>

				<section className="tracker-details-section">
					<TrackerDetailsSources type="imported scan(s)"
						sources={ scans_seen_on } />
				</section>

				<section className="tracker-details-section">
					<TrackerDetailsSources type="sample dataset(s)"
						sources={ samples_seen_on } />
				</section>
			</div>
		);
	}
});

module.exports = TrackerDetails;