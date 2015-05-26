var passport = require('passport');
var User = require('../models/User');

exports.getLogin = function(req, res) {
	if(req.user) return res.redirect('/');
	res.render('account/login', {
		title: "Login"
	});
};

exports.postLogin = function(req, res, next) {
	req.assert('email', 'Email is not valid').isEmail();
	req.assert('password', 'Password cannot be blank').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
    console.log(errors);
		req.flash('errors', errors);
		return res.redirect('/login');
	}
	passport.authenticate('local', function(err, user, info) {
		if (err) return next(err);
		if (!user) {
      req.flash('errors', { msg: info.message });
		  return res.redirect('/login');
		}
		req.logIn(user, function(err) {
      req.flash('success', { msg: 'Success! You are logged in.' });
		  if (err) return next(err);
		  res.redirect(req.session.returnTo || '/');
		});
    failureFlash: true
	})(req, res, next);
}

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getRegister = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/register', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postRegister = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Password do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/register');
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/register');
    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        res.redirect('/');
      });
    });
  });
};

exports.getProfile = function(req, res, next) {
  if (!req.user) return res.redirect('/');
  res.render('account/profile', {
    title: "Profile"
  })
};

exports.updateProfile = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/profile');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.cat = req.body.cat || '';

    user.save(function(err) {
      if (err) return next(err);
      res.redirect('/profile');
    });
  })
}
