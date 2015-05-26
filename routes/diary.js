var passport = require('passport');
var Diary = require('../models/Diary');
var User = require('../models/User');

exports.getDiary = function(req, res, next) {
  if (!req.user) return res.redirect('/login');
  Diary.find({user: req.user.id}, function(err, doc) {
    console.log(doc);
    if (err) return next(err);
    res.render('diary/list-diary', {
      title: "My Cat Diary",
      data: doc
    });
  });
}

exports.getNewDiary = function(req, res, next) {
  if (!req.user) return res.redirect('/login');
  res.render('diary/new-diary', {
    title: 'Create New Diary'
  });
}

exports.postNewDiary = function(req, res, next) {
  var diary = new Diary({
    title: req.body.title,
    post: req.body.post,
    date: new Date(),
    user: req.user.id
  });

  diary.save(function(err, doc) {
    if (err) return console.error(err);
    res.redirect('/');
  });
}