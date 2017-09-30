/* jshint varstmt:false, node:false, browser:true */
/* globals geofs, multiplayer, componentHandler */

window.addEventListener('deferredload', function () {
	'use strict';

    geofs.PRODUCTION = false;

	// Fixes google maps API problem
	window.google = {};
	$('<script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBlCxVOtJO6rKOmWnIhHSWx2EHzU_7hakQ"></script>').appendTo('head');

    // Adds aircraft button
    $('ul.geofs-aircraft-list li').remove();

	for (var aircraft in geofs.testAircraftList) {
	    $('ul.geofs-aircraft-list').append($('<li>')
	        .attr('data-aircraft', aircraft)
	        .text(geofs.testAircraftList[aircraft].name)
	    );
	}

    // Adds the debug button
    $('.geofs-editor-role').attr('style', 'display: inline-block !important');

    // Switches JSON and Javascript mode
    var JSONMode = false;

    function switchMode() {
        for (var aircraft in geofs.testAircraftList) {
			geofs.testAircraftList[aircraft].isCommunity = JSONMode;
		}
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
		if (+id >= Object.keys(geofs.testAircraftList).length) id = 0;
        $.ajax(geofs.testAircraftList[id].fullPath + 'aircraft.json?killcache=' + Date.now(), {
            dataType: 'text',

            success: function (data, error, a) { // jshint ignore:line
                if (error !== 'error') {
					var aircraftRecord = geofs.testAircraftList[id];
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
    multiplayer.stopUpdates();
    multiplayer.on = false;
    $('input#enableMultiplayer').removeAttr('update').prop('disabled', true);

    // Upgrades DOM
    componentHandler.upgradeDom();
});
