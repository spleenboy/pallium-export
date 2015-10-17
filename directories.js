var targz = require('tar.gz');
var path  = require('path');
var fs    = require('fs');

var plugins = require(process.cwd() + '/app/services/plugins');

var Definition = plugins.require('models/entry-definition');
var log        = plugins.require('services/log')(module);
var future     = plugins.require('services/future');
var random     = plugins.require('util/random');
var config     = plugins.require('config');

function Directories() {
    this.list = {};
    this.exportDir = path.join(__dirname, '/tmp');
    this.expiration = 5 * 60 * 1000; // 5 minutes
    this.compressed = {};
}

Directories.prototype.compress = function(id, callback) {

    var dir = this.find(id);

    if (!dir || !dir.path) {
        log.error("Invalid id", id, dir);
        callback(null, new Error('Invalid id'));
        return null;
    }

    var name = path.basename(dir.path);
    var file = name + '-' + random.id() + '.tar.gz';
    var dest = path.join(this.exportDir, file);
    var self = this;

    function expired() {
        delete self.compressed[id];
        fs.unlink(dest);
    }

    future.schedule(dest, expired, this.expiration);

    log.info("Starting compression of directory", dir, "to", dest);
    return targz().compress(dir, dest)
        .then(function() {
            self.compressed[id] = dest;
            callback(dest);
        })
        .catch(function(err) {
            self.compressed[id] = dest;
            callback(dest, err);
        });
};

Directories.prototype.load = function() {
    this.list = {};

    var fromConfig = config.get('export.directories');
    if (fromConfig !== undefined) {
        this.list = fromConfig;
        return this.list;
    }

    var definition = new Definition();

    for (var domain in definition.domains) {
        definition.domain = domain;
        this.list[domain] = {
            id: domain,
            name: definition.get('name'),
            path: definition.get('output')
        };
    }

    return this.list;
};

Directories.prototype.find = function(id) {
    if (!this.list.length) {
        this.load();
    }
    if (id) {
        return this.list[id];
    }
    return this.list;
}

module.exports = new Directories();
