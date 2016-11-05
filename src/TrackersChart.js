import React from 'react';

// Components
import { Bar } from 'react-chartjs';

const sortBy = require('lodash.sortby');

const default_fill_color = '#d7d7d7';
const default_stroke_color = '#d7d7d7';
const default_highlight_fill = '#ff0000';
const default_highlight_stroke = '#ff0000';

const TrackersChart = React.createClass({

	// This component draws a bar chart for the most encountered third-party
	// domains. Each bar corresponds to a third-party domain. The height of the
	// bar (y axis) corresponds to the number of sources where the third-party
	// domain has been found.
	//
	// The event of clicking a bar should show more details in an other
	// component of the app. This component just has to forward the information
	// to its parent that will handle the state for this.
	handleChartClick(e) {
		// Bars that have been clicked. Usually one. If there are more, just
		// take the first one
		const bars = this.refs.chart.getBarsAtEvent(e);
		if (bars.length > 0) {
			const clickedTracker = bars[0].label;
			console.log(bars);
			if (clickedTracker) {
				this.props.onTrackerClick(clickedTracker);
			}
		}
	},

	render() {
		const fill_color = this.props.fill_color || default_fill_color;
		const stroke_color = this.props.stroke_color || default_stroke_color;
		const highlight_fill = this.props.highlight_fill
			|| default_highlight_fill;
		const highlight_stroke = this.props.highlight_stroke || default_highlight_stroke;

		// Shorthand variable
		const { trackers, ...other } = this.props;
		const sorted_trackers = sortBy(trackers, 'source_keys.length').reverse().slice(0, 10);

		// Prepare data set
		const chartData = {
			labels: sorted_trackers.map(tracker => tracker.full_domain),
			"datasets": [{
				label: 'Number of sources per third-party domain',
				data: sorted_trackers.map(tracker => tracker.source_keys.length),
				fillColor: fill_color,
				strokeColor: stroke_color,
				highlightFill: highlight_fill,
				highlightStroke: highlight_stroke,
				strokeWidth: 1,
			}]
		};

		const chartOptions = {
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'probability'
					}
				}]
			}
		}
		return (
			<div className="chart-wrapper">
				<Bar data={chartData} ref="chart" options={chartOptions}
					width={800} height={700}
					onClick={ this.handleChartClick }/>

				<p className="caption">Number of points of presence per
				third-party domain</p>
			</div>
		);
	}
});

module.exports = TrackersChart;