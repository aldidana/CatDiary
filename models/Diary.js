var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/User');

var diarySchema = new mongoose.Schema({
	title: String,
	post: String,
	date: Date,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Diary', diarySchema);