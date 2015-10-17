var util  = require('util');
var path = require('path');

var plugins = require(process.cwd() + '/app/services/plugins');
var Parent = plugins.require('controllers/controller');
var config = plugins.require('config');
var log    = plugins.require('services/log')(module);

var directories = require('./directories');

function Controller() {
    Parent.call(this);
    this.viewBase = __dirname;
}

util.inherits(Controller, Parent);


Controller.prototype.asset = function() {
    var name = this.request.params.name;
    var assetpath = path.join(__dirname, 'views', name);
    return this.response.sendfile(assetpath);
};


Controller.prototype.download = function() {
    var id = this.request.params.id;
    var tarpath = directories.compressed[id];

    if (tarpath) {
        this.response.setHeader('Content-disposition', 'attachment; filename=' + path.basename(tarpath));
        this.response.sendfile(tarpath);
    }
};


Controller.prototype.compress = function() {
    var respond = this.request.io.emit.bind(this.request.io);
    var id = this.request.data;
    var data = directories.find(id);

    if (!id || !data) {
        return respond('export/error', {error:'Invalid id'});
    }

    function done(dest, err) {
        if (err) {
            log.error('Could not compress!', dest, err);
            data.error = err;
            respond('export/error', data);
        } else {
            log.info('Compressed!', dest, err);
            respond('export/compressed', data);
        }
    }

    directories.compress(id, done);
    return respond('export.compressing', id);
};

module.exports = Controller;
