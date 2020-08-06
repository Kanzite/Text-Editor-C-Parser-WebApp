var express = require('express');
var body_parser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

var homeRouter = express.Router();
homeRouter.use(body_parser.json());

homeRouter.route('/')
.get((req, res, next) => {
	res.statusCode = 200;
	res.sendFile(path.join(__dirname, '../public/home.html'));
});

module.exports = homeRouter;