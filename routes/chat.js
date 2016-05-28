var express = require('express');
var router = express.Router();
var tools = require('./chattools.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
    tools.checkproxy(req);
    res.render('chat/home', {
        title: "comp.pw~ chat"
    });
});
module.exports = router;