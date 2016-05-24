var request = require('request')
var fs = require('fs')
module.exports = {
    down: function(url, path, callback) {
        // console.log('downloading: '+url)
        // console.log('to: '+path)
        request({
            uri: url
        }).pipe(fs.createWriteStream(path)).on('error', function(e) {
            console.log(e)
        }).on('close', function() {
            callback();
        });
    },
    makelinkid: function(url, linkdb, callback) {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < 6; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        linkdb.findOne({
            urlid: text
        }, function(err) {
            // doc is the document Mars
            // If no document is found, doc is null
            if (err) {
                callback(null, err)
            } else {
                callback(text)
            }
        });
    }
}