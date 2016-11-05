import React from 'react';
import { L as Leaflet } from 'leaflet'; /* L is conventional name for Leaflet */

// Components
import { Map, Marker, TileLayer, AttributionControl } from 'react-leaflet';
import LocationDetails from './LocationDetails';

// Constants
const default_initial_center = [46.778518, 6.65886]; // HEIG-VD
const default_initial_zoom = 2;
const default_marker_size = [30, 30];

const TrackersMap = React.createClass({

	// This is a stateful component. Its state depends on the user clicking the
	// a marker on the map. If a marker is clicked, the bottom block is expanded
	// to show more informations (the table of trackers located at this
	// position). The block disappears (selected_location := null) when the user
	// clicks on the "close" button on the expanded bottom block 
	getInitialState() {
		return { selected_location: null };
	},

	// This function is called to set the new selected_location. Pass `null` to
	// set no specific location
	setSelectedLocation(location) {
		this.setState({ selected_location: location });
	},

	render() {
		// Shorthand variables
		const { locations, ...other } = this.props;


		// Get initial params passed as a property, or get the default values if
		// not provided
		const initial_center = this.props.initial_center
			|| default_initial_center;
		const initial_zoom = this.props.initial_zoom || default_initial_zoom;
		const marker_size = this.props.marker_size || default_marker_size;


		// Create a marker for every location. Each marker is a single "divIcon"
		// containing the number of trackers at that position. It is stylized
		// in CSS in a separate stylesheet to be shapped as a circle. If a
		// location has no trackers, don't show it.
		const markers = Object.keys(locations).map(location_key => {
			const location = locations[location_key];
			const tracker_count = Object.values(location.trackers).length;
			if (tracker_count === 0) {
				return null;
			}

			// Icon has a class that changes when the marker is clicked and an
			// html content (the number of trackers at that location).
			let iconClassName = 'trackers-marker ';
			if (this.state.selected_location == location) {
				iconClassName += 'open';
			} else if (this.state.selected_location) {
				iconClassName += 'closed';
			}

			const icon = L.divIcon({
				className: iconClassName,

				 // icon label = trackers count
				'html': tracker_count,
				'iconSize': marker_size
			});

			const latlng = [location.lat, location.lng];
			
			return (
				<Marker key={ latlng[0] + latlng[1] } position={ latlng }
					icon={ icon }
					onClick={ this.setSelectedLocation.bind(this, location) } />
			);
		});

		// Note that the map has an "onClick" event that resets the selected
		// location to null, so the user can click outside of the marker to
		// unselect it.
		return (
			<div id="map-wrapper">
				<Map center={ initial_center } zoom={ initial_zoom }
					id="leaflet-map" attributionControl={ false }
					onClick={ this.setSelectedLocation.bind(this, null) }>

					<AttributionControl position="bottomright" />

					{/* <TileLayer
					url={'https://server.arcgisonline.com/ArcGIS/rest/services/' +
						'Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'}
					attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
					/> */}

					<TileLayer
					url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
					attribution={'&copy; <a href="http://www.openstreetmap.org/'
						 + 'copyright">OpenStreetMap</a>'}
					/>
					
					{ markers }
				</Map>
				<LocationDetails{...other }
					location={ this.state.selected_location } />
			</div>
		);
	}
});

module.exports = TrackersMap;