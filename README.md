# sm_website

## Description
Source code for my personal website.

The website consists of a CherryPy server and multiple front end applications utilizing various libraries and frameworks such as AngularJS and Polymer.  The source code for the various web apps can be found in the apps folder.

## Setup
1. Install Dependencies:  Latest Python 2.x, cherrypy and Pillow Python libraries, npm, nodejs, polymer-cli, MariaDB
2. Change the values for the secret token, photos directory, and MariaDB connection credentials in myServer.py
3. In root folder run the command:  npm install
4. In the same root folder run the command:  polymer build
5. Copy the directory inside of build to where you would like to deploy.
6.  Copy other_dependencies directory into your deployment. (Still need to fix some build issues here, this is a workaround).
7. Setup a cron job or use some other method to run startServer.sh in the root of your deployment on boot (OPTIONAL)
