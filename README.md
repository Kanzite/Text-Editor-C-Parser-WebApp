# Text Editor and C Parser - Web Application
**Web Based Text Editor which shows Live Parsing of C Code using Node.js and MongoDB**

## Problem Statement
To develop a convenient way to write C code and get instant parsing of the code, to reduce time spent on saving, compiling and running.

## Solution
Developed a web based text editor which shows live parsing of the C language using a custom made parser and incorporates user authentication and email verification, auto file saving, and user profile details. The parse errors with expected symbols are shown in real time.

## Tech Stack
Node.js, Express, MongoDB, JavaScript, and C Language

Dependencies: mongoose, passport, cookie-parser, debug, express, express-session, http-errors, jade, jsonwebtoken, morgan, multer, nodemailer, passport-jwt, passport-local, passport-local-mongoose, session-file-store, ws

## Project Video
<img src="https://i.imgur.com/trunLHo.gif" width="668" alt="Project Video">

## Screenshots
1. Landing View
<img src="https://i.imgur.com/Aipt3qm.png" width="668" alt="Screenshot One">

2. Login Details (After Registration)
<img src="https://i.imgur.com/iwtbjce.png" width="668" alt="Screenshot Two">

3. Text Editor Default Dashboard
<img src="https://i.imgur.com/xoWjG3I.png" width="668" alt="Screenshot Three">

4. Profile Details (Default)
<img src="https://i.imgur.com/vQAOb4A.png" width="668" alt="Screenshot One">

5. Updated Profile Details
<img src="https://i.imgur.com/CaNUxAo.png" width="668" alt="Screenshot Two">

6. Email Verification
<img src="https://i.imgur.com/RrcDqAh.jpg" width="668" alt="Screenshot Three">

7. Saved Files
<img src="https://i.imgur.com/oVmtWHD.png" width="668" alt="Screenshot Three">

8. Program -- Error in Parser
<img src="https://i.imgur.com/LypHZS8.png" width="668" alt="Screenshot One">

9. Program -- Correct Parser Output
<img src="https://i.imgur.com/MIdakGY.png" width="668" alt="Screenshot Two">

## Instructions

In the project directory, run the following commands and follow on-screen instructions:

1. `npm install`

	Install the dependencies in the local node_modules folder
	
2. `mongod --dbpath=data --bind_ip 127.0.0.1`

	Run the command inside the folder where MongoDB is installed, and contains a data folder
	<br> Check whether MongoDB is installed correctly by running `mongo` command

3. Update `config.js` file with your credentials
	<br>Use a random 20 letter string in the given format for the SecretKey
	<br>Update Database name (Default: TextEditor)
	<br>Update Email ID and Password that will be used to send Authentication Emails

4. `npm start`

	Runs the app in the development mode

#### Please contact (rastogi_kush@yahoo.co.in) for usage permission and feedback.
