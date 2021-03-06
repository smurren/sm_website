
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

	hidePiImage(hide) {
		this.$["image-pi"].style.visibility = hide ? "hidden": "visible";
	}

	ready(){
		super.ready();
		this.addEventListener('click', this._onClick);
	}


	static get template () {
		return html`

		<style>
			#mainAboutContainer {
				position: relative; 
				display: flex; 
				min-width: 1025px;
			}
			#aboutContainer {
				flex: 1;
				padding: 5px;
				min-width: 612px;
				max-width: 612px;
			}
			.aboutSection {
				padding-left: 8px;
				border: var(--aboutBorder, none);
				border-width: var(--aboutBorderWidth, 0);
			}
			.aboutHeader {
				font-size: 30px;
				margin-bottom: 10px;
				color: var(--aboutHeaderColor, #000);
			}
			#aboutMeName {
				
			}
			#aboutMeJobTitle {
				font-size: 20px;
				margin-bottom: 16px;
			}
			.aboutDescription {
				font-size: 14px;
				
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
		<div id="mainAboutContainer">
			<div id="aboutContainer">
			<div class="aboutSection">
					<div id="aboutMeName" class="aboutHeader">
						Sean Murren
					</div>
					<div id="aboutMeJobTitle">
						Software Engineer
					</div>
					<div id="aboutDescription" class="aboutDescription">
						Creative and solution-oriented Computer Scientist with a wide range of experiences and skills.
					</div>			
			</div>
			<div class="aboutSpacer"></div>
			<div class="aboutSection">
				<div id="aboutWebsiteContainer">
					<div class="aboutHeader">
						Website
					</div>
					<div class="aboutDescription">
						This website is a Polymer 3 application.  It and all of the web applications are hosted on a Raspberry Pi 3 with a CherryPy web server.
					</div>
				</div>
			</div>
			<div class="aboutSpacer"></div>
			<div class="aboutSection">
				<div id="aboutWebsiteContainer">
					<div class="aboutHeader">
						GitHub
					</div>
					<div class="aboutDescription">
						<span>The source code for this website, web applications, and many of the other projects can be found on my GitHub page </span>
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
