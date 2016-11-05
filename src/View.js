import React from 'react';

// Components
import TrackersMap from './TrackersMap';
import TrackersChart from './TrackersChart';

const View = React.createClass({

	// The app offers a button for the visitor to chose between the "map" mode
	// (geographical representation of the trackers location) and the "barchart"
	// mode (number of source where each tracker has been found on).
	getInitialState() {
		return { view_mode: 'map' }
	},


	// Function that is called when the user wants to switch the view mode
	// ("map" or "chart") using the buttons above the view

	changeViewMode(view_mode) {
		this.setState({ view_mode });
	},

	render() {

		const { locations, trackers, ...other } = this.props;

		// The view component to display depends on the mode that the user has
		// clicked
		let view;
		switch (this.state.view_mode) {
			case 'chart':
				view = <TrackersChart trackers={ trackers } />
				break;

			case 'map':
			default:
				view = <TrackersMap { ...other } locations={ locations } />
				break;
		}
		return (
			<div id="view">
				<div className="button-wrapper view-switcher">
					<button
						type="button"
						className={ "secondary " +
							(this.state.view_mode == 'map' ?
								'selected' : '')}
						onClick={ this.changeViewMode.bind(this, 'map') }>

						<i className="material-icons">&#xE55F;</i>
						Map
					</button>
					<button
						type="button"
						className={ "secondary " +
							(this.state.view_mode == 'chart' ?
								'selected' : '')}
						onClick={ this.changeViewMode.bind(this, 'chart') }>

						<i className="material-icons">&#xE24B;</i>
						Chart
					</button>
					<div className="spacer"></div>
				</div>
				{ view }
			</div>
		);	
	}
});

module.exports = View;