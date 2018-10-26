/** 
	Coded by Sean Murren June 2016.

*/


(function(){
	var app = angular.module('homepageApp', ['ngRoute']);		

	/**
	* Configure the Routes
	*/
	app.config(function ($routeProvider, $locationProvider) {
		
		//$locationProvider.html5Mode(true);
		
		$routeProvider
		// Homepage
		.when("/", {
			templateUrl: "apps/homepage/html/home.html", 
			controller: "HomeController"
		})
		// webapps list
		.when("/webapps", {
			templateUrl: "apps/homepage/html/webapps.html", 
			controller: "WebAppsController"
		})
		.when("/resume", {
			templateUrl: "apps/homepage/html/resumePage.html", 
			controller: "ResumeController"
		})
		.when("/404", {
			templateUrl: "apps/homepage/html/404.html"
		})
		.otherwise({
			redirectTo: "/404"
		});
		
		
		
	});

	
	app.controller('MainController', function() {
		
		var m = this;
		
		m.selected = 0;
		m.views = [
			{id: "nav_webapps", text: "Web Apps", url: "#/webapps"},
			//{id: "nav_resume", text: "Resume", url: "#/resume"}
		];
		
		m.setSelected = function(i) {
			console.log(i);
			m.selected = i;
		}

	});

	
	app.controller('HomeController', function() {
		
		var hmCtrl = this;
		
	});
	
	
	app.controller('WebAppsController', function() {
		
		var waCtrl = this;
		
		waCtrl.webapps = [
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
		].reverse();
		
	});
	
	
	app.controller('ResumeController', function() {
		
		var resCtrl = this;
		
	});
	
	
})();
