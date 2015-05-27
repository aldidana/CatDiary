var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/User');

var diarySchema = new mongoose.Schema({
	title: String,
	caption: String,
	date: Date,
	photo: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	share: String
});

module.exports = mongoose.model('Diary', diarySchema);