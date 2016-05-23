var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var async = require('async');
var tools = require('./tools.js');
var Datastore = require('nedb'),
    db = new Datastore({
        filename: 'data.db',
        autoload: true
    });
//storing function for upload action
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        if (file) {
            var extension = path.extname(file.originalname);
            var valid = ['.ico', '.jpg', '.jpeg', '.gif', '.wav', '.mp3', '.bmp', '.png', '.txt', '.mp4', '.avi', '.webm', '.torrent'];
            if (valid.indexOf(extension) == -1) {
                // console.log('invalid extension');
                cb(new Error('Invalid file extension bro'));
            } else {
                cb(null, 'comp' + '-' + Date.now() + extension);
            }
        }
    }
})
var upload = multer({
    storage: storage
}).single('file');

function makeid(id) {
    async.forever(function(next) {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 4; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        var checkdest = path.resolve('webms/' + text + ".webm")
        fs.access(checkdest, fs.F_OK, function(err) {
            if (err) {
                next(text);
            } else {
                console.log(text + " already exists, skipping")
                next()
            }
        });
    }, function(err) {
        // console.log(err)
        id(err)
    });
}
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'comp.pw~'
    });
});
router.get('/compf', function(req, res, next) {
    fs.readdir('./webms', function(e, files) {
        var webm = files[Math.floor(Math.random() * files.length)];
        var webmu = webm.split(".")[0] + "/"
        res.redirect(302, '/compf/' + webmu);
    })
});
router.get('/compf/:vid', function(req, res, next) {
    fs.readdir('./webms', function(e, files) {
        var t = files.length + " webms"
        res.render('compf', {
            title: t
        });
    })
})
router.get('/compf/:vid/video.webm', function(req, res, next) {
    res.sendFile(path.resolve('webms/' + req.params.vid + ".webm"));
})
router.get('/savewebm/*', isboss, function(req, res, next) {
    var url = req.params[0]
    makeid(function(id) {
        tools.down(url, path.resolve('webms/') + "/" + id + '.webm', function() {
            res.redirect('/compf/' + id + '/');
        })
    })
})
//uploadform
router.get('/upload', function(req, res, next) {
    res.render('uploadform', {
        title: 'comp.pw~ upload'
    });
});
//uploadaction
router.post('/upload', function(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            console.log(err)
            res.render('uploaded', {
                title: 'comp.pw~ upload',
                error: err
            })
        } else {
            res.render('uploaded', {
                title: 'comp.pw~ upload',
                file: req.file.path
            })
        }
    });
});

function isboss(req, res, next) {
    if (req.ip == '::ffff:69.23.147.201' || req.ip == 'localhost' || req.ip == '::1') return next();
    res.send("no");
}
router.get('/uploads', isboss, function(req, res, next) {
    fs.readdir('./uploads', function(err, files) {
        if (err) res.send(err);
        else {
            res.render('uploadlist', {
                title: 'comp.pw~ uploads',
                files: files
            })
        }
    })
});
router.get('/deletefile/:file', isboss, function(req, res, next) {
    fs.unlink('./uploads/' + req.params.file, function(err) {
        if (err) res.send(err)
        else res.redirect('/uploads');
    })
})
router.get('/paste', function(req, res, next) {
    res.render('pasteform', {
        title: 'comp.pw~ paste'
    });
});
router.post('/paste', function(req, res, next) {
    var doc = {
        text: req.body.paste,
        upload: new Date()
    };
    db.insert(doc, function(err, newDoc) { // Callback is optional
        if (err) res.send(err);
        else {
            res.render('pasteresult', {
                title: 'comp.pw~ pasted',
                message: '/paste/' + newDoc._id
            });
        }
    });
});
router.get('/paste/:id', function(req, res, next) {
    db.findOne({
        _id: req.params.id
    }, function(err, doc) {
        // doc is the document Mars
        // If no document is found, doc is null
        if (err) res.send(err)
        else {
            console.log(doc)
            res.render('pastedoc', {
                title: 'comp.pw~ ' + doc._id,
                paste: doc.text
            })
        }
    });
})
module.exports = router;