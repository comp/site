var request = require('request')
var fs = require('fs')

module.exports = {
    down: function(url, path, callback)
    {
        // console.log('downloading: '+url)
        // console.log('to: '+path)
        request({uri: url})
          .pipe(fs.createWriteStream(path))
          .on('error', function(e) {
            console.log(e)
          })
          .on('close', function() {
            callback();
        });
    }
}