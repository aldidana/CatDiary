var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
  	title: "Cat's Diary",
  	user: req.user
  });
});

module.exports = router;