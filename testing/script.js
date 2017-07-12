(function (init) {
    // jQuery must be defined
	var timer = setInterval(function() {
        if (window.geofs && geofs.aircraft && geofs.aircraft.instance && geofs.aircraft.instance.object3d) {
            clearInterval(timer);
            init();
        }
    }, 16);
})(function () {

    // Default lists
    var aircraftRecord = {
        id: 'aircraft',
        name: 'My Aircraft',
        fullPath: 'local/aircraft/',
        isPremium: false,
        isCommunity: false
    };

    geofs.PRODUCTION = false;

    // Adds aircraft button
    $('ul.geofs-aircraft-list li').remove();
    $('ul.geofs-aircraft-list').append($('<li>')
        .attr('data-aircraft', 'aircraft')
        .text('My Custom Aircraft')
    );

    // Adds the debug button
    $('.geofs-editor-role').attr('style', 'display: inline-block !important');

    // Switches JSON and Javascript mode
    var JSONMode = false;

    function switchMode() {
        if (JSONMode) aircraftRecord.isCommunity = true;
        else aircraftRecord.isCommunity = false;
    }

    $('.geofs-auth form').remove();

    var switchButton = $('<span class="add-on">[Javascript Mode]</span>').appendTo('.geofs-auth');
    switchButton.click(function() {
        if (JSONMode) {
            switchButton.text('[Javascript Mode]');
            JSONMode = false;
        } else {
            switchButton.text('[JSON Mode]');
            JSONMode = true;
        }

        switchMode();
    });

    // Redefines load functions
    geofs.aircraft.Aircraft.prototype.load = function (id, coordinates, bJustReload) {
        $.ajax('/local/aircraft/aircraft.json', {
            dataType: 'text',

            success: function (data, error, a) {
                if (error !== 'error') {
                    aircraftRecord.definition = btoa(data);
                    data = geofs.aircraft.instance.parseRecord(JSON.stringify(aircraftRecord));
                    if (data) {
                        geofs.aircraft.instance.id = id;
                        aircraftRecord.definition = btoa(data);
                        geofs.aircraft.instance.init(data, coordinates, bJustReload);
                    }
                } else geofs.aircraft.instance.loadDefault('Could not load aircraft file');
            },

            error: function (b, c, f) {
                if (geofs.aircraft["default"] !== id) geofs.aircraft.instance.loadDefault("Could not load aircraft file" + f);
            }
         });
    };

    geofs.aircraft.Aircraft.prototype.change = function (id, bJustReload) {
        id = id || this.aircraftRecord.id;
        geofs.doPause(true);
        this.load(id, this.getCurrentCoordinates(), bJustReload);
    };

    // Disables multiplayer so anything broken won't affect the multiplayer server
    geofs.multiplayerHost = '0.0.0.0';
    multiplayer.stopUpdates();
    multiplayer.on = false;
    $('input#enableMultiplayer').removeAttr('update').prop('disabled', true);

    // Upgrades DOM
    componentHandler.upgradeDom();
});
