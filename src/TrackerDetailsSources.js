import React from 'react';

const TrackerDetailsSources = function(props) {

	// Show sources in a list if there are elements to show. if not, show a
	// generic message.
	const source_list = props.sources.length > 0 ? (
		<ul className="details-source-list">
			{props.sources.map(source =>
				<li className="details-source-item"
					key={ source.source_key }>{ source.name }</li>
			)}
		</ul>
	) : (
		<p>(No source found)</p>
	);

	return (
		<div className="details-source-list-wrapper">
			<h3 className="section-title">
				Seen in { props.sources.length } { props.type }
			</h3>
			{ source_list }
		</div>
	);
}

module.exports = TrackerDetailsSources;