var request = require('request')
var fs = require('fs')
var youtubedl = require('youtube-dl')
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
    downyoutube: function(url, path, callback) {
        // https://www.youtube.com/watch?v=yxggGBYTRXA
        var video = youtubedl(url, ['--format=43']);
        video.on('info', function(info) {
            console.log('Download started');
            console.log('filename: ' + info._filename);
            console.log('size: ' + info.size);
        });
        video.pipe(fs.createWriteStream(path));
        video.on('end', function() {
            console.log('finished downloading!');
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
    },
    validurl: function(url) {
        var re = new RegExp("^" +
            // protocol identifier
            "(?:(?:https?|ftp)://)" +
            // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" + "(?:" +
            // IP address exclusion
            // private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" + "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" + "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broacast addresses
            // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" + "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" + "|" +
            // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
            // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
            // TLD identifier
            "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
            // TLD may end with dot
            "\\.?" + ")" +
            // port number
            "(?::\\d{2,5})?" +
            // resource path
            "(?:[/?#]\\S*)?" + "$", "i");
        return re.test(url);
    }
}