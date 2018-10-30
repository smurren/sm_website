
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

	getHeight() {
		return this.$.mainAboutContainer.clientHeight;
	}

	ready(){
		super.ready();
		this.addEventListener('click', this._onClick);
	}


	static get template () {
		return html`

		<style>
			#aboutContainer {
				flex: 1;
				padding: 5px;
				border: var(--aboutBorder, none);
				border-width: var(--aboutBorderWidth, 0);
			}
			.aboutHeader {
				font-size: 26px;
				margin-bottom: 10px;
			}
			#aboutMeName {
				
			}
			#aboutMeJobTitle {
				font-size: 16px;
				margin-bottom: 16px;
			}
			.aboutDescription {
				font-size: 12px;
				
			}
			.aboutSpacer { 
				height: 40px;
			}
			#image-pi {
				transform: scale(0.8);
				mix-blend-mode: multiply;
				vertical-align: top;
				margin: 85px 0px 0px 85px;

			}
		</style>
		<div id="mainAboutContainer" style=" position: relative; display: flex; min-width: 900px;">
		<div id="aboutContainer">
			<div style="display: inline-block; max-width: 450px;">
			<div id="aboutMeName" class="aboutHeader">
				Sean Murren
			</div>
			<div id="aboutMeJobTitle">
				Software Engineer
			</div>
			<div id="aboutDescription" class="aboutDescription">
				Creative and solution-oriented Computer Scientist with a wide range of experiences and skills.
			</div>
			<div class="aboutSpacer"></div>
			<div id="aboutWebsiteContainer">
				<div class="aboutHeader">
					Website
				</div>
				<div class="aboutDescription">
					This website is a Polymer 3 application.  It and all of the web applications are hosted on a Raspberry Pi 3 with a CherryPy web server.
				</div>
			</div>
			<div class="aboutSpacer"></div>
			<div id="aboutWebsiteContainer">
				<div class="aboutHeader">
					GitHub
				</div>
				<div class="aboutDescription">
					<span>The source code for this website, web applications, and many of the other projects can be found on my Github page </span>
					<a href="http://github.com/smurren">http://github.com/smurren</a>
				</div>
			</div>
			</div>
		
		</div>
		<div style="flex: 1; width: 300px; vertical-align: top;"><img id="image-pi" src="images/raspberrypi3black.jpg"/></img></div>
		</div>

		`;
	}
}

// Register the element with the browser.
customElements.define('home-about',  HomeAbout);
