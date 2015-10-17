(function() {
    var $ = require('jquery');
    $(function() {
        if (!io) {
            $('#exporter').hide();
            console.warn('io is not defined!');
            return;
        }

        var socket = io.connect();

        $('#exporter').on('click', 'a[data-exports]', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $link = $(e.currentTarget);
            $link.attr('disabled', 'disabled');

            socket.emit('export/compress', $link.data('exports'));

            return false;
        });

        socket.on('export/compressed', function(data) {
            $('a[data-exports=' + data.id + ']').removeAttr('disabled');
            if (confirm("Your " + data.name + " download is ready!")) {
                window.location = '/use/export/download/' + data.id;
            }
        });
    });
})();
