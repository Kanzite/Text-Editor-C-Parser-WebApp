var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	name: {
		type: String,
		default: 'Update Name'
	},
	verified: {
		type: Boolean,
		default: false
	},
	photo: {
		type: String,
		default: 'Profile.jpg'
	},
	email: {
		type: String,
		default: 'Please Update'
	},
	mobile: {
		type: String,
		default: 'Please Update'
	}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);