(function(){
	var app = angular.module('piMessager', []);		
	
	
	app.controller('MessageCtrl', ['$http', '$window', function($http, $window) {
		
		msg = this;
		
		msg.message = "";
		msg.messageList = [];
		msg.listEndIndex = 3;
		msg.notAbot = 0;
		msg.username = "";
		msg.thankYouMessage = "";
		msg.dateTime = new Date();
		msg.localTimeModifier = 0;
		msg.blockquoteOffsets = [];
			
		
		/** Submit message to server, as a JSON object.          */
		/** response is a python list with single string element */
		/**                                                      */
		msg.sendMessage = function() {
			
			if (msg.notAbot == 1) {
				
				if (msg.message != "" && msg.username != "") {
				
					msg.thankYouMessage = "Message sent!";

					/** Ensure special character is not in message */
					for (var i = 0; i < msg.message.length; i++) {
						if (msg.message[i] == "&")
							msg.message[i] = " ";
					}

					/** Save data server side and play message from raspberry pi */
					$http({method: 'POST', 
							url: '/PI-Messager/putMessage/',
							data: {
								user: msg.username,
								dateTime: msg.dateTime.toUTCString(),
								messageText: msg.message
							}
					})
					.then(function(response){
						msg.thankYouMessage = response.data[0];
						msg.message = "";
						msg.notAbot = 0;
						msg.getMessagesList();
					},
					function(response){
						msg.thankYouMessage = response.data[0];
					});
				}
				else
					msg.thankYouMessage = "Please leave both message and name.";
			} else
					msg.thankYouMessage = "Submit failed.  Are you a bot?";	
		};
		
		
		/** Requests messages list from server side.*/
		/** response is a python list               */
		/**                                         */
		msg.getMessagesList = function() {
			
			$http({method: 'GET', 
				 	 url: '/PI-Messager/getMessages/'})
			.then(function(response){
				msg.messageList = response.data;
			},
			function(response){
				msg.messageList = ["Error:  No data received..."];
			});
		};
		
		
		/** Infinite scroll */
		/** Slightly modified version of code originally posted by Dasari Srinivas */
		/** http://blog.sodhanalibrary.com/2015/02/detect-when-user-scrolls-to-bottom-of.html#.V0MSVORibM5 */
		/** --------------------------------------------------------------- */
		msg.infScroll = function() {
			var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
			var body = document.body, html = document.documentElement;
			var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
			var windowBottom = windowHeight + window.pageYOffset;
			if (windowBottom >= docHeight) {
				msg.listEndIndex++;
				msg.getMessagesList();
			}
		};		
		angular.element($window).bind("scroll", msg.infScroll);		
		/** --------------------------------------------------------------- */
		
		
		/** Calculate local timezone difference from UTC                     */
		/** Due to the limited requirements of this app the data is saved as */
		/** text in a .txt file.  Date-time info saved as UTC string and     */
		/** converted to local using the offset calculated here              */
		msg.setLocalTimeOffset = function() {
			msg.localTimeModifier = msg.dateTime.getHours() - msg.dateTime.getUTCHours();
		};
		
		
		/** Formart the message data back to a more human  */
		/** readable form.  Also convert UTC time to local */
		/**                                                */
		msg.formatMessage = function(message) {
			var name = "";
			var time = "";
			var hour;
			var timeOfDay = "AM";
			var userMessage = "";
			var part = 1;
			
			/** split data into message, name, time */
			for (var i = 0; i < message.length; i++) {
				if (message[i] == "&")
					part++;
				else {
					if (part == 3)
						userMessage += message[i];
					else if (part == 2)
						time += message[i];
					else /** part == 1 */
						name += message[i];
				}
			}
			/** format time */
			hour = parseInt(time.substring(17,19)) + msg.localTimeModifier;
			
			if (hour >= 12) {
				timeOfDay = "PM";
				if (hour > 12)
					hour -= 12;
			}
			
			/** set time, ie: Mon, 23 May 2016 11:15 AM */
			time = time.substring(0,17) +
				String(hour) + 
					":" + time.substring(20,22) + 
						" " + timeOfDay;
			
			return [userMessage, "by " + name, time];
		};
		
		
		/** Randomize horizontal positioning of the */
		/** blockquotes containing past messages    */
		/**         						             */
		msg.setBlockQuoteMargin = function() {
			var w = window.innerWidth - 360;
			var margin = w * 0.10; 
			var offset;
			var offsetDiff;
			var tempList = [];
			
			w -= 2 * margin;
			
			for (var i = 0; i < 100; i++) {
				offset = margin + w * Math.random(12);
				if (i != 0) {
					while ((offset | 0) == tempList[i-1])
						offset = margin + w * Math.random(12);
				}
				msg.blockquoteOffsets.push(String(offset | 0) + "px");
				tempList.push(offset | 0);
			}
		}
		
		
		/** Return horizontal offset for a blockquote */
		/** based on current index of the ng-repeat.  */
		/** param i = index position        		    */
		msg.getBlockQuoteMargin = function(i) {
			return msg.blockquoteOffsets[i];
		}
		
		
		/** Randomize and set horizontal bars that */
		/** connect to the blockquotes			    */
		/** param i = index position        		 */
		msg.getBarPosition = function(i) {
			var w = window.innerWidth;
			var offset = parseInt(msg.blockquoteOffsets[i].substring(-2));
			
			if (w/2 < offset + 180)
				return {"left": String(offset+354)+"px", "bottom": "100px", "width": String(w-offset-368)+"px"};
			else
				return {"bottom": "120px", "width": String(offset+6)+"px"};
		}
		
		
		msg.setBlockQuoteMargin();
		msg.setLocalTimeOffset();
		msg.getMessagesList();		
		
	}]); 		
	
})();
