var express = require('express');
var body_parser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var nodemailer = require('nodemailer');
var Users = require('../models/user');
var Config = require('../config');

var profileRouter = express.Router();
profileRouter.use(body_parser.json());

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: Config.emailuser,
		pass: Config.emailpass
	}
});

var mailOptions = {
	from: Config.emailuser,
	to: 'default@default.com',
	subject: 'Email Verification for Text Editor',
	text: 'Default'
};

profileRouter.route('/')
.get((req, res, next) => {
	Users.findOne({'username': req.user.username})
	.then((user) => {
		if(user != null) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({ 'success': true, 'user': user });
		}
		else {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({ 'success': false });
		}
	})
	.catch((err) => next(err));
});

profileRouter.route('/verify')
.get((req, res, next) => {
	Users.findOne({'username': req.user.username})
	.then((user) => {
		if(user != null) {
			if(user.email != 'Please Update') {
				mailOptions.to = user.email;
				mailOptions.text = 'Dear ' + user.username + ',\nPlease follow the following link to verify your email!\n\nhttp://localhost:3000/profile/verify/' + user._id + '\n\nRegards,\nSystem Administrator';
				transporter.sendMail(mailOptions, function(error, info) {
					if(!error) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({ 'success': true, 'status': 'Email Sent' });
					}
					else {
						res.statusCode = 401;
						res.setHeader('Content-Type', 'application/json');
						res.json({ 'success': false, 'status': 'Email Not Sent' });
					}
				});
			}
			else {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				res.json({ 'success': false, 'status': 'Email Not Sent' });
			}
		}
		else {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({ 'success': false, 'status': 'Error' });
		}
	})
	.catch((err) => next(err));
});

profileRouter.route('/verify/:userID')
.get((req, res, next) => {
	Users.findOne({'_id': req.params.userID })
	.then((user) => {
		if(user != null) {
			user.verified = true;
			user.save()
			.then((user) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.redirect('http://localhost:3000/home');
			})
			.catch((err) => next(err));
		}
		else {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.redirect('http://localhost:3000/?info=403');
		}
	})
	.catch((err) => next(err));
});

module.exports = profileRouter;