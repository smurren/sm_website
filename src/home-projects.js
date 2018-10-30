
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
//import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class HomeProjects extends PolymerElement {
	static get properties () {
		return {
			projects: {
				type: Array,
				value: [
					{
					header: "C", 
					link: "https://github.com/smurren/homework_customLinuxFileSystem",
					title: "Custom Linux file system",
					text: " – Designed and implemented a binary buddy free data block management scheme.  Compiled modified Linux kernels to mount partitions for testing."
					},
					{
					header: "C++",
					link: "https://github.com/smurren/hw_c_dijkstra",
					title: "Dijkstra's algorithm",
					text: " – Found shortest paths and forwarding tables for router networking."
					},
					{
					header: "Java",
					link: "https://github.com/smurren/hw_java_endianSwap",
					title: "Endian swapping utility",
					text: " – Read binary messages from file, swapped endianness, and wrote data to a binary file."
					},
					{
					header: "Java",
					link: "",
					title: "Hashed binary search tree",
					text: " – Created a generic BST class and indexed objects in a hashed array."
					},
					{
					header: "Java",
					link: "",
					title: "AutoFill using RB Trees and Heaps",
					text: " – Use Red-Black trees to quicken a search and prioritize values using a max heap."
					},
					{
					header: "Python",
					link: "https://github.com/smurren/hw_python_continuous_verification",
					title: "Continuous verification for XP",
					text: " – Script which checked in real time if a java file was modified.  If modified, it was recompiled, ran, and the output file was compared to expected output."
					},
					{
					header: "Python",
					link: "https://github.com/smurren/hw_python_uninformed_search",
					title: "Uninformed search algorithms",
					text: " – Breadth first, depth first, and uniform cost searches. "
					},
					{
					header: "Python",
					link: "https://github.com/smurren/hw_python_local_search",
					title: "Local search algorithms",
					text: " – Hill climbing, simulated annealing, and genetic algorithm searches."
					},
					{
					header: "Python",
					link: "https://github.com/smurren/hw_python_machineLearning",
					title: "Machine learning",
					text: " – Implemented decision tree, naïve bayes, k-nearest neighbor."
					},
					{
					header: "Java/JavaScript",
					link: "https://www.deviantart.com/rockerguyaa/gallery/?catpath=/",
					title: "Generative Art",
					text: " – Digital art created with Java and Javascript based scripts often incorporating some form of randomization. Link is to the gallery of images produced.  Code is not included at this time, but all code used to produce said images was implemented by me."
					}
				]
			}
		};
	}

	constructor() {
		super();
	}

	getHeight() {
		return this.$.projectsContainer.clientHeight;
	}

	ready(){
		super.ready();
	}


	static get template () {
		return html`
			<style>
				#projectsContainer {
					padding: 5px;
					border: var(--projectsBorder, none);
					border-width: var(--projectsBorderWidth, 0);
				}
				.projectHeader {
					font-size: 18px;
				}
				.projectDescription {
					margin: 5px 0px 15px 0px;
				}
				.projectTitle {

				}
				.projectText {

				}
			</style>

			<div id="projectsContainer">
				<template is="dom-repeat" items="[[projects]]" as="p">
						<div class="projectHeader">
							[[p.header]]
						</div>
						<div class="projectDescription">
							<span class="projectTitle">
								<template is="dom-if" if="[[p.link]]"><a href="[[p.link]]">[[p.title]]</a></template>
								<template is="dom-if" if="[[!p.link]]">[[p.title]]</template>
							</span>
							<span class="projectText">
								[[p.text]]
							</span>
						</div>
				</template>
			</div>

		`;
	}
}

// Register the element with the browser.
customElements.define('home-projects',  HomeProjects);
