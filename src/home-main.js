
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './expandable-section.js'
import './home-about.js'
import './home-webapps.js'
import './home-projects.js'

//import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class HomeMain extends PolymerElement {
  static get properties () {
    return {
		sectionToggleFlag: {
			type: Boolean,
			value: false
		},
		_headerHeight: {
			type: Number,  //must be pixels
			value: 34  //NOTE:  For now you need to change --sectionHeight CSS to match this (reason this is private)
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
		if (window.innerWidth < 1025)
			this.$.about.hidePiImage(true);
		window.addEventListener('resize', e => this._windowResized(e));
	}

	_getWindowHeight() {
		return window.innerHeight - this._headerHeight * 3;
	}

	//makes sure section height updates on any window resize.  Also hides Pi image if width too small(position not dynamic currently)
	_windowResized(e) {
		let height = this._getWindowHeight();
		if (this._selectedSection) {
			if (this.sectionToggleFlag === false)  //section state is expanded
				//resize height
				this._selectedSection.updateHeight(height+"px");
		}

		if (window.innerWidth < 1025)
			this.$.about.hidePiImage(true);  //hide = true
		else
			this.$.about.hidePiImage(false);  //hide = false
	}

	_sectionClicked(e) {
		
		let section = e.target;
		let height = this._getWindowHeight(); 
		
		if (this._selectedSection) {
			//another section may be already open
			this._selectedSection.setHeight(this._headerHeight+"px", false);  //second arg is expanded flag, helps expandable-section element handle scrolling
			if (this._selectedSection != section) {
				//section selection has changed
				section.setHeight(height+"px", true);
				this.set('sectionToggleFlag', false);  //true means section closed
			}
			else {
				//section selection same, expanded status being toggled
				if (this.sectionToggleFlag === false)
					section.setHeight(this._headerHeight+"px", false);
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
			--sectionHeight: 34px; 
			--sectionFontSize: 11px;
			--sectionTransitionSpeed: 750ms;
			--sectionHeaderWidth: calc(100% - 16px);
			--aboutHeaderColor: #7a7a7a;
			--aboutBorder: solid #7a7a7a;
			--aboutBorderWidth: 0px 0px 0px 14px;
			--webappsHeaderColor: #a9a9a9;
			--webappsBorder: solid #a9a9a9;
			--webappsBorderWidth: 0px 0px 0px 14px;
			--projectsHeaderColor: #3d3935;
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
					background-color="#a9a9a9"
					border-width="2px 0px 0px 15px"
					on-section-clicked="_sectionClicked">
					
					<home-about id="about"></home-about>

				</expandable-section>
			</div>
		</div>

		<div>
			<div class="sectionContainer" style="width: 85%; float: right; flex: 1;">
				<expandable-section 
					header="Web Applications" 
					header-position="left"
					color="#7a7a7a" 
					background-color="#3d3935"
					border-width="2px 15px 0px 0px"
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
					color="#7a7a7a" 
					background-color="#7a7a7a"
					border-width="2px 0px 0px 15px"
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
