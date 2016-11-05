import React from 'react';

const ToggleForm = React.createClass({

	// This is a stateful component. Its state depends on the user clicking the
	// button to open or close its content. Initially, the component is closed.
	getInitialState() {
		return { open: false };
	},

	// Change the state from "open" to "closed" (or invertedly)
	switchState() {
		this.setState({ open: !this.state.open });
	},

	render() {
		// Shorthand variables
		const {
			children,
			open_action_text,
			close_action_text,
			submit_text,
			...other
		} = this.props;

		// CSS class of the form needs to have an indicator whether the form is
		// open of closed
		const formClassName = "toggle-form " + (this.state.open ? 'open' : 'closed');

		// Render
		return <form { ...other } className={ formClassName }>
			{ this.state.open ? (
				<div className="toggle-form-content">
					{ children }
					<div className="button-wrapper">
						<button type="button" className="secondary"
							onClick={ this.switchState }>
							{ close_action_text }
						</button>
						<button type="submit" className="secondary highlight">
							{ submit_text }
						</button>
					</div>
				</div>
			) : (
				<div className="toggle-form-content">
					<div className="button-wrapper">
						<button type="submit" className="secondary"
							onClick={ this.switchState }>
							{ open_action_text }
						</button>
					</div>
				</div>
			)}
		</form>
	}
});

module.exports = ToggleForm;
