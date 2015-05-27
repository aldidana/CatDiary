var express = require('express');
var router = express.Router();
var Diary = require('../models/Diary');
var User = require('../models/User');
var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
	// Diary.find({share: 'public'}).sort({date: 'desc'}).exec(function(err, docs) {
	// 	if (err) return next(err);

	// 	var id = docs.map(function(doc) { return doc._id })

	// 	console.log(id)

	// 	User.find(id, function(err, d) {
	// 		var getAuthor = d.map(function(e) { return e.profile.name });
	// 		console.log(getAuthor)
	// 		res.render('index', { 
	// 		  	title: "Cat Diary",
	//   			data: docs,
	//   			author: getAuthor
	//   			// user: currentUser
 //  			});
	// 	});
	// });


	var test = {};
	User.find({}, function(err, docs) {
		var id = docs.map(function(doc) { return doc._id });

		Diary.find({share: "public", user: {$in: id}})
			.populate('user')
			.exec(function(error, posts) {
				console.log(JSON.stringify(posts, null, "\t"));
				console.log(posts);
					res.render('index', {
						title: "Cat Diary",
						data: posts,
					})
			})
		// Diary.find({share: "public", user: {$in: id}}, function(err, doc) {
		// 	// console.log(doc);

		// 	res.render('index', {
		// 		title: "Cat Diary",
		// 		data: doc,
		// 		author: doc.user
		// 	})
		//})
	});
	
});

module.exports = router;
