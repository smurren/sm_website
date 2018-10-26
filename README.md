# sm_website

## Description
Source code for my personal website.

The website consists of a CherryPy server and multiple front end applications utilizing various libraries and frameworks such as AngularJS and Polymer.  The source code for the various web apps can be found in the apps folder.

## Setup
1. Install Dependencies:  Latest Python 2.x, cherrypy and Pillow Python libraries, npm, nodejs, polymer-cli, 
2. Change the values for the secret token, photos directory, and MariaDB connection credentials in myServer.py
3. Setup a cron job or use some other method to run startServer.sh on boot (OPTIONAL)
