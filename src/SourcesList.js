import React from 'react';

// Utils
const map = require('lodash.map');

// Components
import ToggleForm from './ToggleForm';
import SourceRow from './SourceRow';

const SourceList = function (props) {

	// Shorthand variables
	const { sources_by_types, map_id, ...other } = props;

	return <ul id="source-types-list">
		{map(Object.keys(sources_by_types).sort(), source_type_key => {
			const source_type = sources_by_types[source_type_key];

			// If the user can add more items to that source type (for example,
			// by requesting an additional scan, or by adding more third-party
			// domains to his own scans), we show a togglable form to submit
			// the request. The content of the form depends on the type of
			// the source (scan more items of add domains manually).
			let add_more;
			switch (parseInt(source_type_key)) {
			// First case: scan more pages
			case 0: add_more = (
					<ToggleForm action="/submit_scan" method="post"
						open_action_text="Add..." close_action_text="Cancel"
						submit_text="Scan">

						<h2>Scan additional pages</h2>
						<label>
							List of additional web pages to scan *
						</label>
						<textarea name="urls_dump"></textarea>

						<label>Scan scope *</label>
						<br />

						<label>
							<input name="scan_scope" type="radio" value="home_pages"
								defaultChecked="checked" />
							Only the home pages (safer)
						</label>
						<br />

						<label>
							<input name="scan_scope" type="radio"
								value="complete_urls" />
							Complete urls
						</label>
						<br />
						<br />

						<label>E-mail *</label>
						<input type="email" name="email" />

						<input type="hidden" name="map_id" value={ map_id } />

					</ToggleForm>
				);
				break;

			// Second case: add more third-party manually
			case 1: add_more = (
					<ToggleForm action="/submit_import" method="post"
						open_action_text="Add..." close_action_text="Cancel"
						submit_text="Import">

						<h2>Import additional scans</h2>
						<label>Name of scanned device *</label>
						<input type="text" name="title" />

						<label>List of third-party domains *</label>
						<textarea name="domains"></textarea>

						<input type="hidden" name="map_id" value={ map_id } />
					</ToggleForm>
				);
				break;
			}

			// If the source type has at least one source to display, show a
			// list. If not, show a message that says there are no sources to
			// display
			const number_of_sources = Object.values(source_type.sources).length;
			const sources_list = (number_of_sources > 0) ? (
				<ul className="sources-list">
				{map(Object.keys(source_type.sources).sort(), source_key =>
					{

					const source = source_type.sources[source_key];
					return (
						<li className="source-element" key={ source_key }>
							<SourceRow { ...other } source={ source } />
						</li>
					);
				
				})}
				</ul>
			) : (
				<p>No sources to show</p>
			);

			return (
				<li className="source-type-element" key={ source_type_key }>
					<h1 className="source-type-title">
						{ source_type.name }
					</h1>

					{ sources_list }

					{ add_more }
				</li>
			);
		})};
	</ul>;
}

module.exports = SourceList;