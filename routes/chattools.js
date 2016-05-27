var $ = require('cheerio');
var Datastore = require('nedb'),
    db = new Datastore({
        filename: 'bans.db',
        autoload: true
    });
module.exports = {
    checkAdmin: function(socket) {
        if (this.isAdmin(socket)) {
            console.log(socket.handshake.address + " is admin");
            socket.join('admin');
            // console.log(socket.username + " is admin")
            var b = '<input type="button" id="my-button" class="uk-button" value="Admin" onClick="UIkit.offcanvas.show(\'#my-id\');socket.emit(\'update userlist\');"></input>';
            var oc = '<div id="my-id" class="uk-offcanvas"><div class="uk-offcanvas-bar"><div id="ulist"></div></div>';
            socket.emit('inject', b);
            socket.emit('inject', oc);
        } else {
            console.log(socket.handshake.address + " is not admin");
        }
    },
    isAdmin: function(socket) {
        if (socket.handshake.address == "::1" || socket.handshake.address == "::ffff:69.23.147.201") return true;
        return false;
    },
    users: function(io) {
        var users = $("<ul>");
        var ns = io.of("/");
        for (var id in ns.connected) {
            var li = $("<li>");
            var kick = $("<a>");
            kick.attr('onClick', 'socket.emit(\'kick\', \'' + ns.connected[id].id + '\');');
            kick.text("Kick")
            var ban = $("<a>");
            ban.attr('onClick', 'socket.emit(\'ban\', \'' + ns.connected[id].id + '\');');
            ban.text("Ban")
            li.text(ns.connected[id].username + " ");
            li.append(kick + " ")
            li.append(ban)
            users.append(li);
        }
        return users.html();
    },
    checkban: function(socket) {
        // socket.handshake.address
        db.findOne({
            ip: socket.handshake.address
        }, function(err, doc) {
            // doc is the document Mars
            // If no document is found, doc is null
            if (!err && doc) {
                socket.banned = true;
                socket.emit('banned');
                socket.disconnect();
            }
            if (!err && !doc) socket.emit('auth');
        })
    },
    banip: function(ip) {
        db.insert({
            ip: ip
        });
    }
}