var passport = require('passport');
var Diary = require('../models/Diary');
var User = require('../models/User');
var moment = require('moment');
var hbs = require('hbs');

hbs.registerHelper('relativeTime', function(date) {
  return moment(date).fromNow();
});

hbs.registerHelper('dateMonthYearHour', function(date) {
  return moment(date).format('DD-MMM-YYYY, h:mm:ss a');
})

hbs.registerHelper('dateMonthYear', function(date) {
  return moment(date).format('DD MMM, YYYY');
})

exports.getDiary = function(req, res, next) {
  Diary.find({user: req.user.id}).sort({_id: -1}).exec(function(err, docs) {
    console.log(docs);
    if (err) return next(err);
    res.render('diary/list-diary', {
      title: "My Cat Diary",
      data: docs
    });
  });
  // Diary.find({user: req.user.id}, function(err, doc) {
  // });
}

exports.getNewDiary = function(req, res, next) {
  res.render('diary/new-diary', {
    title: 'Create New Diary'
  });
}

exports.postNewDiary = function(req, res, next) {
  req.assert('title', 'Email is not valid').notEmpty();
  req.assert('photo', 'Password cannot be blank').notEmpty();
  req.assert('post', 'Password cannot be blank').notEmpty();

  var photoPath = 'uploads/'
  if (done == true)
  var diary = new Diary({
    title: req.body.title,
    caption: req.body.caption,
    date: new Date(),
    user: req.user.id,
    photo: photoPath + req.files.photo.name,
    share: req.body.shareOptions
  });

  diary.save(function(err, doc) {
    if (err) return console.error(err);
    res.redirect('/diary');
  });
}