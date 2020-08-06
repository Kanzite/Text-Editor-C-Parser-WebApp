var express = require('express');
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');
var File = require('../models/file');
var passport = require('passport');
var multer = require('multer');
var authenticate = require('../authenticate');

router.use(bodyParser.json());

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images');
	},

	filename: (req, file, cb) => {
		cb(null, req.user.username + path.extname(file.originalname));
	}
});

var imageFileFilter = (req, file, cb) => {
	if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return cb(new Error('You can upload only image files!'), false);
	}
	cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFileFilter});

router.get('/', (req, res, next) => {
	User.find({})
	.then((users) => {
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(users);
	}, (err) => next(err));
})

router.post('/signup', (req, res, next) => {
	User.register(new User({username: req.body.username}), 
		req.body.password, (err, user) => {
			if(err) {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				res.json({success: false, status: 'Username Already Exists!'});
			}
			else {
				passport.authenticate('local')(req, res, () => {
					req.body.author = req.user._id;
					File.create(req.body)
					.then((file) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({success: true, status: 'Registration Successful!'});
					})
					.catch((err) => {
						res.statusCode = 500;
						res.setHeader('Content-Type', 'application/json');
						res.json({err: err});
						return;
					})
				});
			}
		});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/fail' }), (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({success: true, status: 'You are successfully logged in!'});
});

router.get('/fail', (req, res) => {
	res.statusCode = 401;
	res.setHeader('Content-Type', 'application/json');
	res.json({success: false, status: 'Wrong Username or Password'});
});

router.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({success: true, status: 'You are successfully logged out!'});
	}
	else {
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.json({success: false, status: 'Not Logged In!'});
	}
});

router.post('/update', (req, res, next) => {
	User.findOne({ 'username': req.user.username })
	.then((user) => {
		if(req.body.name) {
			user.name = req.body.name;
			user.save()
			.then((user) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({ success: true, status: req.body.name });
			})
			.catch((err) => next(err));
		}
		if(req.body.email) {
			user.email = req.body.email;
			user.save()
			.then((user) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({ success: true, status: req.body.email });
			})
			.catch((err) => next(err));
		}
		if(req.body.mobile) {
			user.mobile = req.body.mobile;
			user.save()
			.then((user) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({ success: true, status: req.body.mobile });
			})
			.catch((err) => next(err));
		}
		if(req.body.newpassword) {
			user.changePassword(req.body.oldpassword, req.body.newpassword, (err) => {
				if(!err) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({ success: true, status: req.body.newpassword });
				}
				else {
					res.statusCode = 401;
					res.setHeader('Content-Type', 'application/json');
					res.json({ success: false, status: 'Wrong Password' });
				}
			});

		}
	})
	.catch((err) => next(err));
});

router.post('/upload', upload.single('image'), (req, res, next) => {
	User.findOne({ 'username': req.user.username })
	.then((user) => {
		if(req.file.filename) {
			user.photo = req.file.filename;
			user.save()
			.then((user) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({ success: 'true', status: req.file.filename });
			})
			.catch((err) => next(err));
		}
	})
	.catch((err) => next(err));
})

module.exports = router;
