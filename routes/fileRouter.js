var express = require('express');
var body_parser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var Files = require('../models/file');
var fs = require('fs');
var { exec } = require('child_process');

var fileRouter = express.Router();
fileRouter.use(body_parser.json());

fileRouter.route('/')
.get((req, res, next) => {
	Files.aggregate([{
		"$match": {
			"author": req.user._id
		}
	}, {
		"$unwind": "$doc"
	}, {
		"$sort": {
			"doc.updatedAt": -1
		}
	}, {
		"$group": {
			"doc": {
				"$push": "$doc"
			},
			"_id": 1
		}
	}, {
		"$project": {
			"_id": 0,
			"doc": 1
		}
	}], (err, file) => {
		if(err || file.length == 0) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'application/json');
			res.json({ success: false, status: 'No File Found!' });
			return;
		}
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({ success: true, length: file[0].doc.length, status: file[0].doc });
	})
})
.post((req, res, next) => {
	Files.findOne({ 'author': req.user._id })
	.then((file) => {
		if(file == null) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: false, status: 'Error!'});
		}
		else {
			var flag = 0;
			for (var i = 0; i < file.doc.length; i++) {
				if(file.doc[i].title == req.body.title) {
					file.doc[i].text = req.body.text;
					flag = 1;
				}
			}
			if(flag == 0)
				file.doc.push(req.body);
			file.save()
			.then((file) => {
				fs.writeFile('public/compiler/Input.c', req.body.text, function (err) {
					if(err) {
						res.statusCode = 404;
						res.setHeader('Content-Type', 'application/json');
						res.json({success: false, status: 'Error in File System'});
						return;
					}
				});
				exec('./public/compiler/a.out', (err, stdout, stderr) => {
					if(err) {
						res.statusCode = 404;
						res.setHeader('Content-Type', 'application/json');
						res.json({success: false, status: 'Error in Compilation'});
						return;
					}
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({success: true, status: stdout});
				});
			})
			.catch((err) => next(err));
		}
	})
	.catch((err) => next(err));
});

module.exports = fileRouter;