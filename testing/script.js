geofs.aircraftList = {};
geofs.PRODUCTION = false;

$(function() {
    $('<li>')
        .attr('data-aircraft', 'aircraft')
        .text('My Custom Aircraft')
        .appendTo('ul.geofs-aircraft-list');
});

// Adds the debug button
$(function() {
    $('.geofs-editor-role').attr('style', 'display: inline-block !important');
});

// Switches JSON and Javascript mode
$(function() {
    var JSONMode = false;
    var aircraftListJS = {
        aircraft: {
            name: 'My Custom Aircraft',
            path: 'models/aircraft/aircraft'
        }
    };
    var aircraftListJSON = {
        aircraft: {
            name: 'My Custom Aircraft',
            path: 'backend/aircraft/repository/aircraft'
        }
    };

    function switchMode() {
        if (JSONMode) {
            gefs.aircraftList = aircraftListJSON;
        } else {
            gefs.aircraftList = aircraftListJS;
        }
    }

    $('.gefs-auth form').remove();

    var switchButton = $('<span class="add-on">[Javascript Mode]</span>').appendTo('.gefs-auth');
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
});

var oldLoad = geofs.aircraft.Aircraft.prototype.load;
geofs.aircraft.Aircraft.prototype.load = function(aircraftName, coordinates, bJustReload) {
    oldLoad.call(this, 'aircraft', coordinates, bJustReload);
};

// disable multiplayer so anything broken won't affect the multiplayer server

geofs.multiplayerHost = '0.0.0.0';
multiplayer.stopUpdates();
multiplayer.on = false;
$('input#enableMultiplayer').removeAttr('update').prop('disabled', true);

// upgrade DOM
componentHandler.upgradeDom();
