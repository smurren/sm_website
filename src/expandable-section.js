
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

	/*  Accepts string h parameter.  Include px or %, etc */
	setHeight(h) {
		this.$.container.style.height = h;
	}

	_onClick() {
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
			overflow: hidden;
			-webkit-transition: height var(--sectionTransitionSpeed, 1s);
			 transition: height var(--sectionTransitionSpeed, 1s);
		}
		#headerContainer {
			display: flex;
			align-items:  center;
			height: var(--sectionHeight, 40px);		
			width: calc(100% - 14px);
			cursor: pointer;
		}
     		#header {
			flex: 0;
			padding: 0px 40px 0px 40px;
			white-space: nowrap;
		}
		.spacer {
			flex: 1;
			height: 100%;
		}
		#slotContainer {
			height: 100%; 
			overflow-y: auto;
		}
      </style>

	<div id="container">
		<div id="headerContainer" style="color: [[color]]; border: solid [[backgroundColor]]; border-width: [[borderWidth]];">
			<template is="dom-if" if="[[!_showSpacerLeft]]"><div id="spacer-left" class="spacer"></div></template>
			<div id="header">{{header}}</div>
			<template is="dom-if" if="[[!_showSpacerRight]]"><div id="spacer-right" class="spacer"></div></template>
		</div>
		<div id="slotContainer">
			<slot></slot>
		</div>
	</div>
	
    `;
  }
}

// Register the element with the browser.
customElements.define('expandable-section',  ExpandableSection);
