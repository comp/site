var express = require('express');
var router = express.Router();
var multer  = require('multer');
var mime = require('mime');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    if(file){
        var extension = path.extname(file.originalname);
        var valid = ['.ico','.jpg','.jpeg','.gif','.wav','.mp3','.bmp','.png','.txt','.mp4','.avi'];

        if(valid.indexOf(extension)==-1){
            // console.log('invalid extension');
            cb(new Error('Invalid file extension bro'));
        }
        else
        {
            cb(null, 'comp'+'-'+Date.now() + extension);
        }
    }
  }
})

var upload = multer({ storage: storage }).single('file');





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'comp.pw~' });
});

router.get('/upload', function(req,res,next) {
    res.render('uploadform', {title: 'comp.pw~ upload'});
});

router.post('/upload', function (req, res, next)
{
    upload(req, res, function (err) {
    if (err) {
        console.log(err)
      res.render('uploaded', {title: 'comp.pw~ upload', error: err})
    }
    else
    {
        res.render('uploaded', {title: 'comp.pw~ upload', file: req.file.path})
    }
});

});

module.exports = router;
