
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
//import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class HomeProjects extends PolymerElement {
	static get properties () {
		return {

		};
	}

	constructor() {
		super();
	}

	ready(){
		super.ready();
	}


	static get template () {
		return html`
			projects

		`;
	}
}

// Register the element with the browser.
customElements.define('home-projects',  HomeProjects);
