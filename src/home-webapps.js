
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
						"Worked with a team of 4 other students over entire semester",
						"Met with client to gather/document requirements",
						"Features: Accounts/Authentication, Create/Join study groups, Search Groups, Create/Join Meetings, Asynchronous chat, Report System, Admin",
						"Technologies used: Django, MariaDB, AngularJS, Javascript, HTML/CSS",
						"Originally hosted Externally on Amazon EC2"
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
							"Implemented Infinite Scrolling with AngularJS",
							"Randomized CSS"
						]
					},
					{
						title: "Sudoku Solver",
						date: "May 2016",
						link: "http://seanmurren.com/sudoku/",
						info: [
							"Implements backtracking algorithm to find solution",
							"Also implements a heuristic which selects next cell with least possible valid input values remaining.  This greatly improves performance"
						]
					},
					{
						title: "Magic 8 Ball",
						date: "July 2016",
						link: "http://seanmurren.com/magic8/",
						info: [
							"AngularJS animation: text fade-in",
							"Javascript animation: 'shakes' image"
						]
					},
					{
						title: "Snake Game",
						date: "July 2016",
						link: "http://seanmurren.com/snake/",
						info: [
							"100% Javascript game",
							"Classic snake game with slight twist",
							"Animation done on <canvas>", 
							"Keyboard controls",
							"Adjustable grid size, animation speed"
						]
					},
					{
						title: "Photography Web Application",
						date: "October 2018",
						link: "http://seanmurren.com/photos/",
						info: [
							"AngularJS based web app",
							"Implemented server and client code/styling from scratch",
							"Image upload to server", 
							"EXIF data extracted and stored in MariaDB for image sorting",
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
