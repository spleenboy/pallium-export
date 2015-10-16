module.exports = function() {
    var $ = require('jquery');
    $(function() {
        if (!io) {
            $('#exporter').hide();
            console.warn('io is not defined!');
            return;
        }

        $('#exporter').on('click', 'a[data-exports]', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $link = $(e.currentTarget);
            $link.attr('disabled', 'disabled');
            var href  = $link.attr('href');

            $.get(href);

            return false;
        });

        io = io.connect();

        io.on('export.compressed', function(data) {
            $('a[data-exports=' + data.id + ']').removeAttr('disabled');
            if (confirm("Your " + data.name + " download is ready!")) {
                window.location = '/use/export/download/' + data.id;
            }
        });
    });
};
