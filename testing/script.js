gefs.communityAircraftMap = {};
gefs.PRODUCTION = false;

$(function () {
  $('<li>').append(
    $('<a>')
      .text('My Custom Aircraft')
      .prop('href', '#')
      .mouseup(function () {
        gefs.aircraft.change('aircraft');
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
			gefs.debug.toggleDebug();
		})
	).insertAfter($('.setup-section').eq(getIndex()).children('.btn-group').first());
});

$(function () {
  var JSONMode = false;

  function switchMode () {
    if (JSONMode) {
      gefs.communityAircraftMap = {"aircraft": "models/aircrafts/aircraft"};
    } else {
      gefs.communityAircraftMap = {};
    }
  }
  
  $('.gefs-auth form').remove();

  var switchButton = $('<span class="add-on">[Javascript Mode]</span>').appendTo('.gefs-auth');
  switchButton.click(function () {
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

gefs.multiplayerHost = '0.0.0.0';
multiplayer.stopUpdates();
multiplayer.on = false;
$('input[gespref="gefs.preferences.multiplayer"]').prop('disabled', true);
