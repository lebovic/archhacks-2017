Welcome to the ArchHacks repo
==================================================

This sample code helps get you started with a simple Node.js web application
deployed by AWS CodeDeploy to an Amazon EC2 instance. Express scaffolding was then added in replacement of the AWS non-deploy code.

What's Here
-----------

This sample includes:

* README.md - this file
* appspec.yml - this file is used by AWS CodeDeploy when deploying the web
  application to EC2
* package.json - this file contains various metadata relevant to your Node.js
  application such as dependencies
* public/ - this directory contains static web assets used by your application
* scripts/ - this directory contains scripts used by AWS CodeDeploy when
  installing and deploying your application on the Amazon EC2 instance
* everything else is express scaffolding – update this as the organization of the project evolves

Getting Started
---------------

These directions assume you want to develop on your local computer, and not
from the Amazon EC2 instance itself. If you're on the Amazon EC2 instance, the
virtual environment is already set up for you, and you can start working on the
code.

To work on the sample code, you'll need to clone your project's repository to your
local computer. If you haven't, do that first. You can find instructions in the
AWS CodeStar user guide.

1. Install Node.js on your computer.  For details on available installers visit
   https://nodejs.org/en/download/.

2. Install NPM dependencies:

        $ npm install

2. Start the development server:
On macOS/linux:
        $ DEBUG=archhacks:* npm start
On Windows:
	$ DEBUG=archhacks:* & npm start

3. Open http://localhost:3000/ in a web browser to view your application.

AWS references:
------------------

User Guide: http://docs.aws.amazon.com/codestar/latest/userguide/welcome.html

Forum: https://forums.aws.amazon.com/forum.jspa?forumID=248
