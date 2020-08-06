var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var docSchema = new Schema({
	title: {
		type: String,
		default: ''
	},
	text: {
		type: String,
		default: ''
	}
}, {
	timestamps: true
})

var File = new Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	doc: [ docSchema ]
}, {
	timestamps: true
});

module.exports = mongoose.model('File', File);