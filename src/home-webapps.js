
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
//import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class HomeWebapps extends PolymerElement {
	static get properties () {
		return {
			webapps: {
				type: Array,
				value: () => [
					{
					title: "MyStudyGroupPlanner",
					date: "Spring 2016",
					link: "http://github.com/smurren/myStudyGroupPlanner",
					info: [
						"CMSC447 Software Engineering Group Project",
						"Worked with a team of 4 other students over a full semester",
						"Met with client to gather and document requirements",
						"Features:  'Accounts/Authentication', 'Create/Join study groups', 'Search Groups', 'Create/Join Meetings', 'Asynchronous chat', 'Report System', 'Admin'",
						"Technologies used: Django, MariaDB, AngularJS, JavaScript, HTML/CSS",
						"Originally deployed on Amazon EC2"
					]
					},
					{
						title: "PI-Messager",
						date: "May 2016",
						link: "http://seanmurren.com/PI-Messager/",
						info: [
							"Submitted message is played as audio on Pi's speaker using espeak",
							"Up to 100 messages saved with message, name, date, time",
							"Data saved to txt file, no database used",
							"Infinite Scrolling",
							"Randomized CSS"
						]
					},
					{
						title: "Sudoku Solver",
						date: "May 2016",
						link: "http://seanmurren.com/sudoku/",
						info: [
							"Implements backtracking algorithm to find solution",
							"Employs a heuristic which selects next cell with least possible valid input values remaining which greatly improves performance"
						]
					},
					{
						title: "Magic 8 Ball",
						date: "July 2016",
						link: "http://seanmurren.com/magic8/",
						info: [
							"AngularJS animation:  text fade-in",
							"JavaScript animation:  'shakes' image"
						]
					},
					{
						title: "Snake Game",
						date: "July 2016",
						link: "http://seanmurren.com/snake/",
						info: [
							"100% plain JavaScript game",
							"Classic snake game with slight twist",
							"Animation on <canvas>", 
							"Keyboard controls",
							"Adjustable grid size and animation speed"
						]
					},
					{
						title: "Photography Web Application",
						date: "October 2018",
						link: "http://seanmurren.com/photos/",
						info: [
							"AngularJS based web app",
							"Server and client code implemented from scratch",
							"Web design, HTML/CSS implemented from scratch",
							"Image upload to my CherryPy server", 
							"EXIF data extracted and stored in MariaDB for image sorting",
							"Sort images ascending/descending based of EXIF properties such as f-number, aperture, and ISO",
							"Infinite scrolling"
						]
					}
				].reverse()
			}
		};
	}

	constructor() {
		super();
	}

	getHeight() {
		return this.$.appsContainer.clientHeight;
	}

	ready(){
		super.ready();
	}


	static get template () {
		return html`

			<style>
				#appsContainer {
					border: var(--webappsBorder, none);
					border-width: var(--webappsBorderWidth, 0);
					
				}
				.appContainer {
					width: 550px;
					padding: 8px;
					margin: 10px 0px 10px 0px;
					
				}
				.appHeader {
					font-size: 20px;
					color: var(--webappsHeaderColor, #000);
				}
				.infoContainer {

				}
			</style>

			<div id="appsContainer">
				<template is="dom-repeat" items="[[webapps]]" as="app">
					<div class="appContainer">
						<div class="appHeader">
							<span>[[app.date]]: </span> <span> <a href="[[app.link]]">[[app.title]]</a></span>
						</div>
						<div class="infoContainer">
							<ul>
								<template is="dom-repeat" items="[[app.info]]" as="info">
									<li>[[info]]</li>
								</template>
							</ul>
						</div>
					</div>
				</template>
			</div>

		`;
	}
}

// Register the element with the browser.
customElements.define('home-webapps',  HomeWebapps);
