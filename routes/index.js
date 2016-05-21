var express = require('express');
var router = express.Router();
var multer  = require('multer');
var mime = require('mime');
var path = require('path');
var util = require('util');
var fs = require('fs');
var path = require('path');


var Datastore = require('nedb')
  , db = new Datastore({ filename: 'data.db', autoload: true });




//storing function for upload action
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    if(file){
        var extension = path.extname(file.originalname);
        var valid = ['.ico','.jpg','.jpeg','.gif','.wav','.mp3','.bmp','.png','.txt','.mp4','.avi', '.webm', '.torrent'];

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

router.get('/compf', function(req, res, next) {
  fs.readdir('./webms', function(e,files)
  {
    var title = files.length+ " webms"
    res.render('compf', {title: title});
  })
});

router.get('/video.webm', function(req,res,next)
{
  fs.readdir('./webms', function(e,files)
  {
    var webm = files[Math.floor(Math.random()*files.length)];
    res.sendFile(path.resolve('webms/'+webm));
  })
})


//uploadform
router.get('/upload', function(req,res,next) {
    res.render('uploadform', {title: 'comp.pw~ upload'});
});

//uploadaction
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

function isboss(req,res,next)
{
  if(req.ip == '::ffff:69.23.147.201' || req.ip == 'localhost' || req.ip == '::1')
    return next();
  res.send("no");
}

router.get('/uploads', isboss, function(req, res, next)
{
  fs.readdir('./uploads', function(err, files)
  {
    if(err)
      res.send(err);
    else
    {
      res.render('uploadlist', {title: 'comp.pw~ uploads', files: files})
    }
  })

});

router.get('/deletefile/:file', isboss, function(req,res,next)
{

  fs.unlink('./uploads/'+req.params.file, function(err)
  {
    if(err)
      res.send(err)
    else
      res.redirect('/uploads');
  })
})

router.get('/paste', function(req,res,next)
{
  res.render('pasteform', {title: 'comp.pw~ paste'});
});

router.post('/paste', function(req,res,next)
{
  var doc = {
    text: req.body.paste,
    upload: new Date()
  };

db.insert(doc, function (err, newDoc) {   // Callback is optional
  if(err)
    res.send(err);
  else
  {
    res.render('pasteresult', {title: 'comp.pw~ pasted', message: '/paste/'+newDoc._id});
  }
});
});

router.get('/paste/:id', function(req,res,next)
{
  db.findOne({ _id: req.params.id }, function (err, doc) {
  // doc is the document Mars
  // If no document is found, doc is null
  if(err)
    res.send(err)
  else{
    console.log(doc)
    res.render('pastedoc', {title: 'comp.pw~ '+doc._id, paste: doc.text})
  }
});






})

module.exports = router;
