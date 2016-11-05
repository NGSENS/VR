import React from 'react';

// Components
import TrackersTable from './TrackersTable';

const SourceRow = React.createClass({

	// This is a stateful component. Its state depends on the user clicking the
	// button to open or close the details of the row. Initially, the component
	// is closed.
	getInitialState() {
		return { open: false };	
	},

	// Change the state from "open" to "closed" (or invertedly)
	switchState(event) {
		// Avoid jumping back at top of page because of href="#"
		event.preventDefault();

		// Set state
		this.setState({ open: !this.state.open });
	},


	// A row represents a source. A source has a checkbox that allows the user
	// to consider (checked) or ignore (unchecked) that source. Because other
	// component of the app take that state into account, this state is not
	// kept in this component. Instead, a state change (checkbox clicked) is
	// propagated to the parent component using the `handleSourceClick` callback
	// property.
	handleSourceClick() {
		this.props.handleSwitchSourceState(this.props.source.source_key);
	},

	render() {

		// Short-hand variables
		const { source, ...other } = this.props;

		// If the component is open, we should show more details and the "close"
		// button. If it is closed, we should just show an "open" button
		const moreDetails = this.state.open ? (
			<div className="more-details">
				<a className="material-icons" href="#"
					onClick={ this.switchState }>
					&#xE313;
				</a>
				<TrackersTable { ...other } trackers={ source.trackers } />
			</div>
		) : (
			<div className="more-details">
				<a className="material-icons" href="#"
					onClick={ this.switchState }>
					&#xE315;
				</a>
			</div>
		);

		return (
			<div className="source-row">
				<label className="source-name">
					<input type="checkbox" checked={ source.is_active }
					onChange={ this.handleSourceClick } />
					{ source.name }
				</label>
				{ moreDetails }
				<div className="spacer"></div>
			</div>
		);
	}
});

module.exports = SourceRow;