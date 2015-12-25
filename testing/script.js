ges.communityAircraftMap = {};
ges.PRODUCTION = false;

$(function () {
  $('<li>').append(
    $('<a>')
      .text('My Custom Aircraft')
      .prop('href', '#')
      .mouseup(function () {
        ges.aircraft.change('aircraft');
      })
  ).appendTo($('.dropdown-menu').eq(2).empty());
});

// Adds the debug button. 
$(function () {
$('<div>')
    .addClass('btn-group debug-button')
    .css('margin-left','7px')
    .append($('<button>')
    	.addClass('btn btn-warning')
	    .text('Debug')
	    .click(function() {
			ges.debug.toggleDebug();
		})
	).insertAfter($('.setup-section').eq(getIndex()).children('.btn-group').first());
});

// Finds the appropriate element to place the debug button.
function getIndex() {
	for (var i = 0; i < $('.setup-section').length; i++)
		if ($('.setup-section').eq(i).children('.btn-group').first().children('.btn').text().trim() === "Aircraft")
			return i;
	return -1;
}

var oldLoad = Aircraft.prototype.load;
Aircraft.prototype.load = function (aircraftName, coordinates, bJustReload) {
  oldLoad.call(this, 'aircraft', coordinates, bJustReload);
};

// disable multiplayer so anything broken won't affect the multiplayer server

ges.multiplayerHost = '0.0.0.0';
multiplayer.stopUpdates();
multiplayer.on = false;
$('input[gespref="ges.preferences.multiplayer"]').prop('disabled', true);
