import os, os.path
import cherrypy
from cherrypy import tools
import json
import pymysql
import sys
import subprocess

import PIL.Image
import PIL.ExifTags

######################################################################################
# 																																			   #
#				CHANGE THE SECRET TOKEN, PHOTO DIRECTORY, AND MARIADB CONNECTION CREDENTIALS 			   #
#																																			   #
######################################################################################

SECRET_TOKEN = "CHANGE ME"
PHOTOS_DIRECTORY = "/CHANGE ME/directory/path/here"

def getMariaDBConnection():
	mariadb = pymysql.connect(host="CHANGE ME", user="CHANGE ME", passwd="CHANGE ME", db="CHANGE ME", cursorclass=pymysql.cursors.DictCursor)		
	return mariadb, mariadb.cursor()

class Homepage(object):
	@cherrypy.expose
	def index(self):
		return open('index.html')

class Magic8(object):
	@cherrypy.expose
	def index(self):
		return open('apps/magic8/html/index.html')

class PhotosApp(object):

	def writeImage(self,  filename, data):

		mariadb, cursor = getMariaDBConnection()
		
		existingImages = os.listdir(PHOTOS_DIRECTORY)

		if filename in existingImages:
			return False

		#write the image to disk
		print("writing image "+ filename)
		with open(PHOTOS_DIRECTORY+filename, 'wb') as f:
			f.write(data)

		#generate thumbnail
		os.system("convert "+PHOTOS_DIRECTORY+filename+" -resize 346x194 "+PHOTOS_DIRECTORY+"/thumbnails/"+filename)

		#get exif data from new image
		img = PIL.Image.open(PHOTOS_DIRECTORY+filename)

		exif = {
			PIL.ExifTags.TAGS[k]: v
			for k, v in img._getexif().items()
			if k in PIL.ExifTags.TAGS
		}
		DateTimeDigitized = exif.get("DateTimeDigitized").split()[0].replace(":", "-") + " " + exif.get("DateTimeDigitized").split()[1]
		DateTimeOriginal = exif.get("DateTimeOriginal").split()[0].replace(":", "-") + " " + exif.get("DateTimeOriginal").split()[1]

		cursor.execute( "REPLACE INTO Images VALUES (" + 
			"'"+filename + "', " +
			str(exif.get("LightSource")) + ", " +
			str(exif.get("ResolutionUnit")) + ", " +
			"'"+exif.get("Make") + "', " +
			str(exif.get("Flash")) + ", " +
			str(exif.get("SceneCaptureType")) + ", " +
			str(exif.get("MeteringMode")) + ", " +
			str(exif.get("Contrast")) + ", " +
			str(exif.get("Saturation")) + ", " +
			str(exif.get("ExposureProgram")) + ", " +
			str(exif.get("FocalLengthIn35mmFilm")) + ", " +
			str(exif.get("ExifImageWidth")) + ", " +
			"'"+DateTimeDigitized + "', " +
			"'"+DateTimeOriginal + "', " +
			"'"+exif.get("LensModel") + "', " +
			str(exif.get("WhiteBalance")) + ", " +
			str(exif.get("FNumber")[0] / (exif.get("FNumber")[1]*1.0)) + ", " +
			str(exif.get("CustomRendered")) + ", " +
			str(exif.get("ApertureValue")[0] / (exif.get("ApertureValue")[1]*1.0)) + ", " +
			str(exif.get("FocalLength")[0] / (exif.get("FocalLength")[1]*1.0)) + ", " +
			str(exif.get("ExposureMode")) + ", " +
			"'"+exif.get("ImageDescription") + "', " +
			str(exif.get("ExifImageHeight")) + ", " +
			str(exif.get("ISOSpeedRatings")) + ", " +
			"'"+exif.get("Model") + "', " +
			"'"+exif.get("Software") + "', " +
			str(exif.get("ExposureTime")[0] / (exif.get("ExposureTime") [1]*1.0)) + ", " +
			str(exif.get("MaxApertureValue")[0] / (exif.get("MaxApertureValue")[1]*1.0)) + ", " +
			str(exif.get("Sharpness")) + ", " +
			str(exif.get("DigitalZoomRatio")[0] / (exif.get("DigitalZoomRatio")[1]*1.0)) + 
			")"
		)
		mariadb.commit()
		mariadb.close()
		
		return True

	@cherrypy.expose
	def index(self):
		return open('apps/photosApp/html/index.html')

	@cherrypy.expose
	@cherrypy.tools.json_out()
	def sortoptions(self):
		mariadb, cursor = getMariaDBConnection()
		cursor.execute("SELECT * FROM Images LIMIT 1;")
		rows = cursor.fetchall()
		mariadb.close()
		return rows[0].keys()

	@cherrypy.expose
	@cherrypy.tools.json_out()
	def gallery(self, sortCol):
		mariadb, cursor = getMariaDBConnection()
		cursor.execute("SELECT * FROM Images;")
		rows = cursor.fetchall()
		mariadb.close()

		#sort if not set to "None"
		if sortCol != "None":
			rows_sorted = []
			rows_sorted = sorted(rows, key = lambda row: row[sortCol])
			return map(lambda row: ["photos/"+row.get("Filename"), "photos/thumbnails/"+row.get("Filename")], rows_sorted)
		else:
			return list(map(lambda x: [ "photos/"+x, "photos/thumbnails/"+x], os.listdir(PHOTOS_DIRECTORY+"thumbnails")))

	@cherrypy.expose
	def upload(self, secret, files):	
		
		imageWritten = False

		if secret == SECRET_TOKEN:
			#save image to flash drive
			if type(files) == list:
				for image in files:
					imageWritten = self.writeImage(image.filename, image.file.read())
			else:
				imageWritten = self.writeImage(files.filename, files.file.read())
			if (imageWritten):
				return json.dumps({"success": True})
			else:
				return json.dumps({"success": False, "reason": "Image name already exists"})
		else:
			return json.dumps({"success": False, "reason": "Invalid Token"})
	
class Snake(object):
	@cherrypy.expose
	def index(self):
		return open('apps/snake/html/index.html')	
  
class Processing(object):
	@cherrypy.expose
	def index(self):
		return open('apps/processing/html/nature1.html')
	
class DbTest(object):

	mariadb, cursor = getMariaDBConnection()

	@cherrypy.expose
	def index(self):
		return open('html/dbtest/dbtest.html')

	@cherrypy.expose
	def createTables(self):	

		cursor.execute("CREATE TABLE IF NOT EXISTS User ( " +
					   "ID INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, " + 
					   "Email VARCHAR(30) NOT NULL, " + 
					   "Password INT UNSIGNED, " +
					   "FirstName VARCHAR(10), " +
					   "LastName VARCHAR(15), " + 
					   "DisplayName VARCHAR(15));")
		if not mariadb.show_warnings():
			print("Table created:  User")		
			
	
	@cherrypy.expose
	def deleteTable(self, tableName):
		cursor.execute("DROP TABLE " + tableName + ";")
		print("table: " + tableName + " removed")
	
	@cherrypy.expose
	def showTables(self):
		cursor.execute("show tables;")	
		
		tableList = []
		for tables in cursor:
			tableList.append(tables[0])
		
		return json.dumps(tableList)

	@cherrypy.expose
	@cherrypy.tools.json_out()
	def describeTable(self, tableName):
		
		#cursor.execute("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='test' AND `TABLE_NAME`='User';")
		cursor.execute("SELECT * FROM " + tableName + ";")
		rows = cursor.fetchall()
		
		return rows
			
	@cherrypy.expose
	@cherrypy.tools.json_in()
	def insertToTable(self):
		# Inserts one row into a table.  Takes any number of attributes.
		# JSON INPUT FORMAT: ["User", {"key1":"name", "Key2":40}]
		# MYSQL FORMAT: "INSERT INTO tableName (key1, key2) VALUES ("name", 40);"
		
		data = cherrypy.request.json	# data[0]=table, data[1]=dict of attributes
		
		insertString = "INSERT INTO " + data[0] + " ("
		keys = list(data[1].keys())
		for key in keys:
			insertString += key + ", "
		insertString = insertString[:-2] + ") VALUES ("
		for key in keys:
			if type(data[1][key]).__name__ == 'str':
				insertString += "'" + data[1][key] + "', "
			else:
				insertString += str(data[1][key]) + ", "
		insertString = insertString[:-2] + ");"
		
		#print(insertString)
		try:
			cursor.execute(insertString)
			mariadb.commit()
			return "Success"
		except:
			return "Fail"
		
			
	@cherrypy.expose
	def removeFromTable(self, table, key, value):
		# DELETE ONE ROW FROM TABLE
		# QUERY= "DELETE FROM table WHERE key=value;"
		try:
			cursor.execute("DELETE FROM " + table + " WHERE " + key + "=" + value + ";")
			mariadb.commit()
			return "Success"
		except:
			return "Fail"
	
	

	

class PiMessager(object):
	
	@cherrypy.expose
	def index(self):
		return open('apps/piMessager/html/index.html')
	
	@cherrypy.expose
	@cherrypy.tools.json_in()
	@cherrypy.tools.json_out()
	def putMessage(self):
		
		try:
			txtfile = open("voicemail-messages.txt", 'a')

			message = cherrypy.request.json
			
			# have raspberry pi output message as speech through speaker
			subprocess.call(["espeak", "-s 125", message["messageText"]])
			
			txtfile.write("& " + message["user"] + "&" + message["dateTime"] + "&" + message["messageText"] + "\n")
			txtfile.close()
			
			return ["Message Received.  Thank you!"]
		
		except Exception,e:
			print("Error: myServer.py --> PiMessager --> putMessage(): " + str(e))
			return ["Error: Unable to play/record message on the PI."]

		
	@cherrypy.expose
	@cherrypy.tools.json_out()
	def getMessages(self):
		
		# list of messages loaded from text file, returned to client
		output = []

		try:
			resultsFile = open("voicemail-messages.txt", 'r+')
			
			lines = resultsFile.readlines()
			resultsFile.seek(0)
			
			# truncate older messages (past 100th)
			lineCount = 0
			if len(lines) > 100:
				lineCount = len(lines) - 100
			if lineCount > 0:			
				for i in range(100 + lineCount):
					resultsFile.write(i)
			
			# add messages to output list
			for line in lines:
				if line[0] == "&":
					output.insert(0, line[1:])
				else:
					output.insert(0, line)
					
			resultsFile.close()
			
			return output
		
		except:
			# something went wrong trying to load messages
			handle_error() # return a general 500 error
			
	
	
class TwitterApp(object):
	
	def validateToken(self, token):
		
		if token[:5] == "hide-":
			token = token[5:]
		
		return token == SECRET_TOKEN		
	
	
	@cherrypy.expose
	def index(self):
		return open('html/twitter/index.html')
		
	
	@cherrypy.expose
	@cherrypy.tools.json_in()
	@cherrypy.tools.json_out()
	def doPublicSearch(self):
		
		searchFilter = cherrypy.request.json
		
		if self.validateToken(searchFilter["token"]):
			output = []
			p1 = subprocess.Popen(["python3", "pyscripts/twitterapp.py", searchFilter["track"]])
			p1.wait()

			resultsFile = open("tweets.txt", 'r')

			for line in resultsFile:
				if len(line) > 45:
					jsonString = line[:-1]
					output.append(json.loads(jsonString))
			return output
		else:
			return ["Invalid token"]
		
		

		
class SudokuSolver(object):
		
	@cherrypy.expose
	def index(self):
		return open('apps/sudoku/html/index.html')
		

def error_page_404(status, message, traceback, version):
	return "<div style='font-size: 40px; font-weight: bold; margin-top: 50px; text-align: center;'>404</div><div style='text-align: center;'>"+message+"</div>"
		
# used to return error to client when try/except blocks fail	
@cherrypy.expose		
def handle_error():
	cherrypy.response.status = 500


		
			
		
		
if __name__ == '__main__':
	
	cherrypy.server.socket_host = '0.0.0.0'
	cherrypy.server.socket_port = 80
	
	HERE = os.path.dirname(os.path.abspath(__file__))
	
	
	
	config = {
		'/apps': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': os.path.join(HERE, 'apps')},
		'/photos': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': PHOTOS_DIRECTORY}
	}

	#cherrypy.tree.mount(TwitterApp(), '/twitter', config)
	cherrypy.tree.mount(PhotosApp(), '/photos', config)
	cherrypy.tree.mount(PiMessager(), '/PI-Messager', config)
	cherrypy.tree.mount(SudokuSolver(), '/sudoku', config)
	#cherrypy.tree.mount(DbTest(), '/dbtest', config)
	cherrypy.tree.mount(Processing(), '/processing', config)
	cherrypy.tree.mount(Magic8(), '/magic8', config)
	cherrypy.tree.mount(Snake(), '/snake', config)
	cherrypy.tree.mount(Homepage(), '/', config)
	
	cherrypy.config.update({'error_page.404': error_page_404})	

	cherrypy.engine.start()
	cherrypy.engine.block()
	
