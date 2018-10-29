
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './expandable-section.js'
import './home-about.js'
import './home-webapps.js'
import './home-projects.js'
//import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class HomeMain extends PolymerElement {
  static get properties () {
    return {
    		//sections: {
		//	type: Array,
		//	value: () => [
		//		{title: "Sean Murren", width: "95%", align: "left", headerPosition: "right", color: "#7a7a7a", backColor: "#bcbcbc", active: false}, 
		//		{title: "Web Applications", width: "90%", align: "right", headerPosition: "left", color: "#bcbcbc", backColor: "#3d3935", active: false},
		//		{title: "Other Projects", width: "70%", align: "left", headerPosition: "right", color: "#3d3935", backColor: "#7a7a7a", active: false}
		//	]
		//},
		sectionToggleFlag: {
			type: Boolean,
			value: false
		},
		_selectedSection: {
			type: Object  //dom element
		}
    };
  }

  constructor() {
    super();
  }

	ready(){
		super.ready();

	}

	_sectionClicked(e) {
		let section = e.target;
		let height = window.innerHeight - 96;  //browser height - 3x header height
		
		if (this._selectedSection) {
			this._selectedSection.setHeight("32px", false);  //second arg is expanded flag, helps expandable-section element handle scrolling
			if (this._selectedSection != section) {
				section.setHeight(height+"px", true);
				this.set('sectionToggleFlag', false);
			}
			else {
				if (this.sectionToggleFlag === false)
					section.setHeight("32px", false);
				else {
					section.setHeight(height+"px", true);
				}
				this.set('sectionToggleFlag', !this.sectionToggleFlag);
			}
		}
		else {
			section.setHeight(height+"px", true);
		}

		this.set('_selectedSection', section);
	}
  

  static get template () {
    return html`
      <style>
		:host {
			--sectionHeight: 32px;
			--sectionFontSize: 11px;
			--sectionTransitionSpeed: 750ms;
			--aboutBorder: solid #7a7a7a;
			--aboutBorderWidth: 0px 0px 0px 14px;
			--webappsBorder: solid #bcbcbc;
			--webappsBorderWidth: 0px 0px 0px 14px;
			--projectsBorder: solid #3d3935;
			--projectsBorderWidth: 0px 0px 0px 14px;
		}
		#homeContainer {
			height: 100%;
			display: flex;
			flex-direction: column;
		}
		.active-spacer {
			flex: 1;
		}
		.sectionContainer {
			font-weight: bold; 
			margin: 2px 0px 2px 0px;
		}
      </style>
		
	<div id="homeContainer">

		<div id="spacer-left" class="active-spacer"></div>

		<div>
			<div class="sectionContainer" style="width: 92%; float: left; flex: 1;">
				<expandable-section 
					header="About" 
					header-position="right"
					color="#7a7a7a" 
					background-color="#bcbcbc"
					border-width="2px 0px 0px 14px"
					on-section-clicked="_sectionClicked">
					
					<home-about></home-about>

				</expandable-section>
			</div>
		</div>

		<div>
			<div class="sectionContainer" style="width: 85%; float: right; flex: 1;">
				<expandable-section 
					header="Web Applications" 
					header-position="left"
					color="#bcbcbc" 
					background-color="#3d3935"
					border-width="2px 14px 0px 0px"
					on-section-clicked="_sectionClicked">
					
					<home-webapps></home-webapps>

				</expandable-section>
			</div>
		</div>

		<div>
			<div class="sectionContainer" style="width: 69%; float: left; flex: 1;">
				<expandable-section 
					header="Other Projects" 
					header-position="right"
					color="#3d3935" 
					background-color="#7a7a7a"
					border-width="2px 0px 0px 14px"
					on-section-clicked="_sectionClicked">
					
					<home-projects></home-projects>

				</expandable-section>
			</div>
		</div>

		<div id="spacer-right" class="active-spacer"></div>

	</div>
    `;
  }
}

// Register the element with the browser.
customElements.define('home-main', HomeMain);
