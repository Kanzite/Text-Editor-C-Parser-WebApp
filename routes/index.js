var express = require('express');
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
	}
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
