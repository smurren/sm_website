
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
//import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class HomeAbout extends PolymerElement {
	static get properties () {
		return {

		};
	}

	constructor() {
		super();
	}

	ready(){
		super.ready();
		this.addEventListener('click', this._onClick);
	}


	static get template () {
		return html`
			about

		`;
	}
}

// Register the element with the browser.
customElements.define('home-about',  HomeAbout);
