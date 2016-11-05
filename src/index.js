import React from 'react';
import ReactDOM from 'react-dom';

// Utils
const mapValues = require('lodash.mapvalues');
const pickBy = require('lodash.pickby');
const includes = require('lodash.includes');
const some = require('lodash.some');
const zipObject = require('lodash.zipobject');
const map = require('lodash.map');
const sortBy = require('lodash.sortby');

// Components
import SourcesList from './SourcesList';
import View from './View';
import TrackerDetails from './TrackerDetails';

const App = React.createClass({

	// The App component keeps the global state of its sub-components. This
	// is sufficient for now but it might become useful to consider Flux or
	// Redux if the app grows.

	// The global state of the app contains two main informations:
	// 1. The sources that should be considered. The left panel contains a
	//    checkbox for each source. If it is checked, then the source is
	//    taken into account in the rest of the app.
	//    For example, if the user wishes to see trackers that were found on a
	//    single page, say yahoo.com/jobs/, he can uncheck other sources from
	//    his history. The map should reflect those changes by only displaying 
	//    trackers found on that specific page.
	//
	// 2. At several location in the app, the user can click a domain, a main-
	//    domain, or an organization to see more details about it. When such an
	//    element is clicked, the state of the application must reflect that
	//    action, by displaying a component at the bottom of the page. The app
	//    has to keep two variables for that state: the tracker that should be
	//    detailed, and the type of details we want about that tracker
	//    (`full_domain`, `main_domain` or `organization`)

	getInitialState() {
		return {
			// Originally, all sources are taken into account
			active_sources_keys: this.props.initial_active_sources_keys,
			clicked_tracker: null,
			detail_type: 'full_domain'
		}
	},

	
	// Function to be called when the user clicks on a checkbox to
	// enable/disable a source. This function is propagated down to the
	// SourceRow component that calls it when its checkbox is changed.

	handleSwitchSourceState(source_key) {
		const active_sources_keys = this.state.active_sources_keys;
		// If source was in enabled sources, remove it. If it was in disabled
		// sources, add it.
		const source_key_position = active_sources_keys.indexOf(source_key);
		if (source_key_position !== -1) {
			this.setState({
				active_sources_keys: active_sources_keys
				.slice(0,source_key_position)
				.concat(active_sources_keys.slice(source_key_position + 1))
			});
		} else {
			this.setState({
				active_sources_keys: [...active_sources_keys, source_key].sort()
			});
		}
	},

	// When the user clicks on a tracker inside a "TrackersTable", a component
	// should be displayed with more information about that tracker. The
	// TrackersTable component calls this function. It passes the key of the
	// tracker and the type of detail that should be displayed. The type of
	// detail can be one of `full_domain`, `main_domain` or `organization`.

	showTrackerDetails(tracker_key, detail_type) {
		// Find the tracker with that key
		const clicked_tracker = this.props.trackers[tracker_key];

		// Set state
		this.setState({ clicked_tracker, detail_type });
	},

	render () {

		const active_sources_keys = this.state.active_sources_keys;
		// Get active sources
		const active_sources = zipObject(active_sources_keys,
			map(active_sources_keys, source_key => data.sources[source_key]));


		// Build a list of only active trackers. Active trackers are trackers
		// that appear in at least one active source
		const active_trackers = sortBy(
				pickBy(trackers, tracker_object =>
					some(tracker_object.source_keys, source_key =>
						includes(active_sources_keys, source_key.toString()))),
				'order');


		// For every locations, retrieve the trackers that have that location
		const trackers_by_location =
			mapValues(data.locations, (location_object, location_key) => {

			const trackers_at_this_location = pickBy(active_trackers, tracker =>
				tracker.location == location_key);

			location_object.trackers = trackers_at_this_location;
			return location_object;
		});


		// For every source type, retrieve the sources that have that type (1)
		// and for every source, check whether it is active (checked by the
		// user) (2), retrieve the trackers found in that source (3) Finally,
		// store every source and its trackers in a property of the source
		// type (4)
		const sources_by_types =
			mapValues(data.source_types, (type_object, type_key) => {

			// (1)
			const sources = pickBy(data.sources, source =>
					source.type == type_key);


			const sources_with_trackers =
				mapValues(sources, (source, source_key) => {

				source.source_key = source_key;

				// (2)
				source.is_active = includes(active_sources_keys, source_key);

				// (3)
				source.trackers = pickBy(trackers, tracker =>
					includes(tracker.source_keys, source_key));

				return source;
			});

			// (4)
			type_object.sources = sources_with_trackers;
			return type_object;
		});

		// Render the source list, the view (map or chart)
		return (
			<div id="app">
				<SourcesList sources_by_types={ sources_by_types }
					handleSwitchSourceState={ this.handleSwitchSourceState }
					onTrackerClick={ this.showTrackerDetails }
					map_id= { this.props.map_id } />

				<View trackers={ active_trackers } locations={ trackers_by_location }
					onTrackerClick={ this.showTrackerDetails } />

				<div className="spacer"></div>

				{ this.state.clicked_tracker ? (
					<TrackerDetails tracker={ this.state.clicked_tracker }
						type={ this.state.detail_type }
						sources={ active_sources }
						onTrackerClick={ this.showTrackerDetails } />
				) : '' }
			</div>
		);
	}
});

// For every tracker, retrieve the main domain and organization
const trackers = mapValues(window.data.trackers, (tracker_object, tracker_key) => {
	tracker_object.main_domain =
		window.data.main_domains[tracker_object.main_domain_key];
	tracker_object.organization =
		window.data.organizations[tracker_object.organization_key];

	tracker_object.tracker_key = tracker_key;
	
	return tracker_object;
});

ReactDOM.render(<App trackers={ trackers } map_id={ window.map_id }
	initial_active_sources_keys={ Object.keys(data.sources) } />,
	document.getElementById('content'));