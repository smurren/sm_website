
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
//import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class ExpandableSection extends PolymerElement {
  static get properties () {
    return {
		/* The text to be displayed.. */
    		header: {
			type: String
		},
		/* Possible values:  'LEFT', 'CENTER', 'RIGHT'.  Not case sensitive. */
		headerPosition: {
			type: String,
			observer:  "_headerPositionChange",
			value:  "CENTER"
		},
		width: {
			type: String,
			value: "100%"
		},
		height: {
			type: String,
			value: "100%"
		},
		color: {
			type: String,
			value: "#000"
		},
		backgroundColor: {
			type: String,
			value: "#FFF"
		},
		borderWidth: {
			type: String,
			value: "0px 0px 2px 0px"
		},
		_showSpacerLeft: { type: Boolean, value: false },
		_showSpacerRight: { type: Boolean, value: false }
    };
  }

	constructor() {
		super();
	}

	ready(){
		super.ready();
		this.$.headerContainer.addEventListener('click', this._onClick.bind(this));
	}

	updateHeight(h) {
		this.$.container.style.height = h;
	}

	/*  Accepts string h parameter.  Include px or %, etc .  Because of this the caller must say if new height is expanding or not*/
	setHeight(h, expanded) {

		let delay = this._delayMS();
		let overflow = window.getComputedStyle(this.$.slotContainer).overflow;

		this.updateHeight(h) ;

		if (expanded)
				this.$.slotContainer.style.overflow = "hidden";

		setTimeout(function(){

			let slotHeight = this.$.slotContainer.clientHeight;
			let contentHeight = this.$.slot.assignedNodes({flatten: true})[1].getHeight();

			if (slotHeight < contentHeight)
				this.$.slotContainer.style.overflow = "auto";
			else
				this.$.slotContainer.style.overflow = "hidden";

		}.bind(this), delay);
	}

	_delayMS() {
		let delayString = window.getComputedStyle(this.$.container).transition.split(" ")[1];
		let webkitDelayString = window.getComputedStyle(this.$.container).getPropertyValue("-webkit-transition-duration");
		let mozDelayString = window.getComputedStyle(this.$.container).getPropertyValue("-moz-transition-duration");

		return parseFloat(delayString || webkitDelayString || mozDelayString) * 1000.0;
	}

	_onClick() {	
		//thow click event for parent elements
		this.dispatchEvent(new CustomEvent('section-clicked', {detail: {}}));
	}

	_headerPositionChange(val, oldval) {
		
		switch(val.toUpperCase()) {
			case "LEFT": this._showSpacerLeft = true; this._showSpacerRight = false; break;
			case "CENTER": this._showSpacerLeft = true; this._showSpacerRight = true; break;
			case "RIGHT": this._showSpacerLeft = false; this._showSpacerRight = true; break;
			default: align = "center";
		};
	}
  

  static get template () {
    return html`
      <style>
		#container {
			height: var(--sectionHeight, 100%);		
			width: var(--sectionWidth, 100%);
			-webkit-transition: height var(--sectionTransitionSpeed, 1s);
			-webkit-transition-timing-function: ease;
			-moz-transition: height var(--sectionTransitionSpeed, 1s);
			-moz-transition-timing-function: ease;
			 transition: height var(--sectionTransitionSpeed, 1s);
			transition-timing-function: ease;
			padding: 2px 0px 2px 0px;
			overflow: hidden;
		}
		#headerContainer {
			display: flex;
			align-items:  center;
			height: var(--sectionHeight, 40px);		
			width: var(--sectionHeaderWidth, 100%);
			cursor: pointer;
			margin-bottom: 10px;
		}
     		#header {
			flex: 0;
			padding: 0px var(--sectionHeight, 40px) 0px var(--sectionHeight, 40px);
			white-space: nowrap;
		}
		.spacer {
			flex: 1;
			height: 100%;
		}
		#slotContainer {
			/* height: calc(100% - 96px); */
			height: 100%;
			padding: 15px 18px 15px 14px;
			overflow: hidden;
		}
      </style>

	<div id="container">
		<div id="headerContainer" style="color: [[color]]; border: solid [[backgroundColor]]; border-width: [[borderWidth]];">
			<template is="dom-if" if="[[!_showSpacerLeft]]"><div id="spacer-left" class="spacer"></div></template>
			<div id="header">{{header}}</div>
			<template is="dom-if" if="[[!_showSpacerRight]]"><div id="spacer-right" class="spacer"></div></template>
		</div>
		<div id="slotContainer">
			<slot id="slot"></slot>
		</div>
	</div>
	
    `;
  }
}

// Register the element with the browser.
customElements.define('expandable-section',  ExpandableSection);
