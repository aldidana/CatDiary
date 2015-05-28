var express = require('express');
var router = express.Router();
var Diary = require('../models/Diary');
var User = require('../models/User');
var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
	User.find({}, function(err, docs) {
	var id = docs.map(function(doc) { return doc._id });

		Diary.find({share: "public", user: {$in: id}})
			.sort({_id: -1})
			.populate('user')
			.exec(function(error, posts) {
				console.log(JSON.stringify(posts, null, "\t"));
				console.log(posts);
					res.render('index', {
						title: "Cat Diary",
						data: posts,
					})
			})
	});
	
});

module.exports = router;
