#Python3 Tweet analysis using Twitter API 

# chmod u+x python_script.py
# needed to run above line in terminal to set execute permissions of
# this script so it could be called by my server as a subprocess

# CUSTOMIZED CODE BY SEAN MURREN.  ORIGINAL CODE POSTED BY ADIL MOUJAHID ON HIS BLOG:
# 'An Introduction to Text Mining using Twitter Streaming API and Python'
# which can be found at: http://adilmoujahid.com/posts/2014/07/twitter-analytics/

import tweepy
import json

import sys
import os
import time

import urllib.request 

#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

#Variables that contains the user credentials to access Twitter API 
access_token = "CHANGEME"
access_token_secret = "CHANGEME"
consumer_key = "CHANGEME"
consumer_secret = "CHANGEME"


#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):
	
	def on_data(self, data):
		
		global startTime
		global tweetCount
		# sets max run time in seconds
		if (time.time() - startTime) > 60:
			txtfile.close()
			quit()
		# sets max number of results
		if tweetCount >= 50:
			txtfile.close()
			quit()
		
		text = '""'
		username = ""
		image = ""
		gif = ""
		mp4 = ""
		periscope = ""
		
		tweet = json.loads(data)
		
		#print(tweet + "\n\n")
		
		try:
			username = json.dumps(tweet["entities"]["user_mentions"][0]["screen_name"]).replace('"','')
		except:
			pass
		
		try:
			image = json.dumps(tweet["entities"]["media"][0]["media_url"]).replace('"','')
			#print(image)
			try:
				text = json.dumps(tweet["retweeted_status"]["text"])
				text = text[:-24] + '"'
			except:
				pass
			
			filename = image.split('/')[-1]
			print(image)
			urllib.request.urlretrieve(image, 'images/twitter/' + str(startTime)[:-8] + '/' + filename)
			#print(text)
				
			#tweetCount += 1;
		except:
			pass
		try:
			mp4 = json.dumps(tweet["extended_entities"]["media"][0]["video_info"]["variants"][0]["url"]).replace('"','')
			if mp4[-4:] != ".mp4":
				mp4 = ""
			else:
				filename = mp4.split('/')[-1]
				urllib.request.urlretrieve(mp4, 'images/twitter/' + str(startTime)[:-8] + '/' + filename)
			#print(mp4)
		except:
			pass
		try:
			gif = json.dumps(tweet["entities"]["urls"][0]["expanded_url"]).replace('"','')
			if gif[12:21] == "periscope":
				periscope = gif
				#tweetCount += 1;
				#print(time.asctime())
			if gif[-4:] != ".gif":
				gif = ""
			else:
				filename = gif.split('/')[-1]
				urllib.request.urlretrieve(gif, 'images/twitter/' + str(startTime)[:-8] + '/' + filename)
			#print(gif)
		except:
			pass
		
		
		if image != "" or mp4 != "" or gif != "" or periscope != "":
			tweetCount += 1;
			#print(json.dumps(tweet, indent=2, sort_keys=True))
			# Record json data to a text file
			txtfile.write("{\"user\":\"" + username + "\", \"text\":" + text + ", \"image\":\"" + image + "\", \"gif\":\"" + gif + "\", \"mp4\":\"" + mp4 + "\", \"periscope\":\"" + periscope + "\"}\n")
		
		return True

	
	def on_error(self, status):
		print(status)

		

		
# globals
tweetCount = 0
startTime = time.time()
os.mkdir('images/twitter/' + str(startTime)[:-8])

		
if __name__ == '__main__':

	txtfile = open("tweets.txt", 'w')

	#This handles Twitter authetification and the connection to Twitter Streaming API
	l = StdOutListener()
	auth = OAuthHandler(consumer_key, consumer_secret)
	auth.set_access_token(access_token, access_token_secret)
	stream = Stream(auth, l)

	#This line filter Twitter Streams to capture data by the keywords
	stream.filter(track=sys.argv)