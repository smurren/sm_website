/** 
	Coded by Sean Murren July 2016.
*/


(function(){
	var app = angular.module('magic8App', ['ngAnimate']);		

	app.controller('Magic8BallController', function() {
		
		var m8Ctrl = this;
		
		m8Ctrl.message = [];  // used to output answer client side
		
		m8Ctrl.answers = [
			["It is", "certain"],
			["It is", "decidedly so"],
			["Without a", "doubt"],
			["Yes,", "definitely"],
			["You may rely", "on it"],
			["As I see it,", "yes"],
			["Most likely"],
			["Outlook good"],
			["Yes"],
			["Signs point to", "yes"],
			["Reply hazy", "try again"],
			["Ask again", "later"],
			["Better not", "tell you", "now"],
			["Cannot predict", "now"],
			["Concentrate", "and ask", "again"],
			["Don't count", "on it"],
			["My reply is", "no"],
			["My sources", "say no"],
			["Outlook not", "so good"],
			["Very doubtful"]
		];
		
		
		// initialize image object
		m8Ctrl.imgObj = document.getElementById('magic8ball');
		m8Ctrl.imgObj.style.position= 'relative';
		m8Ctrl.imgObj.style.left = '0px';
		m8Ctrl.imgObj.style.top = '0px';
		
		
		/** Selects an answer from answers list */
		/** Called when SHAKE button is clicked */
		/** 											 	*/
		m8Ctrl.getAnswer = function() {
			
			var shakeCounter = 2;  // number of times to shake
			m8Ctrl.shake(shakeCounter);
			
			var answer = [];
			
			do {
				
				answer = m8Ctrl.answers[parseInt(20 * Math.random())];
				
			} while (answer == m8Ctrl.message);
			
			m8Ctrl.message =  answer;
			
		};
		

		/** Shakes the image object twice.      */
		/** Called by getAnswer function when   */
		/** SHAKE button is clicked			 	 */
		m8Ctrl.shake = function (counter) {
			
			if (counter > 0) {
				
				counter -= 1;
				
				setTimeout(function(){
					m8Ctrl.imgObj.style.left = parseInt(m8Ctrl.imgObj.style.left) + 50 + 'px';
					m8Ctrl.imgObj.style.top = parseInt(m8Ctrl.imgObj.style.top) + 50 + 'px';
				},125);
				setTimeout(function(){
					m8Ctrl.imgObj.style.left = parseInt(m8Ctrl.imgObj.style.left) - 50 + 'px';
					m8Ctrl.imgObj.style.top = parseInt(m8Ctrl.imgObj.style.top) - 50 + 'px';
					m8Ctrl.shake(counter);
				},250);
			}
		};
		
		
	});
	
	
})();
