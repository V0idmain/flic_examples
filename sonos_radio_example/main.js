// Example of playing sonos radio stations
// Tested with Sonos and Pandora stations
var Sonos = require("./Sonos");
var buttonManager = require("buttons");

// Set IP address (192.168.86.78) to your sonos device ip
// You can get this from settings/about my system in the ios/android app
// Recommend: that you set a static ip/pinning for the device in your router
const sonos = new Sonos.Sonos("192.168.86.78", 1400);

// Change to 0 to stop logging
var debug = 1;

// Notes:
// CouldNotConnect? Probably have the wrong IP address

var Radio = {
	// YOUR_BUTTON_NAME: SONOS STATION ID
	// Station ID can be retrieved from the stations page
	// Example: https://play.sonos.com/en-us/browse/services/77575/program/sonos%3A2994
	// ID is: sonos%3A2994
	ANDREW_BIRD: "ST%3a274927084354516601",
	BONNIE_RAITT: "ST%3a2587142300322084473",
	BOWIE: "SF%3a16722%3a81499",
	CLASH: "SF%3a16722%3a67665",
	TALKINGHEADS: "ST%3a92936222485258575",
	SONOSRADIO: "sonos%3a3058",
	PHIL: "SF%3a16722%3a70542",
}

var ButtonEvent = {
	buttonSingleOrDoubleClickOrHold: "buttonSingleOrDoubleClickOrHold"
}

var ClickType = {
	click: "click",
	doubleClick: "double_click",
	hold: "hold"
}

function log(err, response) {
	if (debug == 1) {
		if (err !== null) {
			console.log(err);
		}
		if (response !== null) {
			console.log(JSON.stringify(response));
		}
	}
}

buttonManager.on(ButtonEvent.buttonSingleOrDoubleClickOrHold, function(obj) {
	var button = buttonManager.getButton(obj.bdaddr);
	var clickType = obj.isSingleClick ? "click" : obj.isDoubleClick ? "double_click" : "hold";

	// If the button clicked matches a station name
	if (Radio.hasOwnProperty(button.name)) {
		if (clickType === ClickType.click) {
			sonos.setRadioUri(Radio[button.name], function(err, response) {
				log(err, response);
				sonos.play(function(err, response){
					log(err, response);
				});
			});
		}		
	}
	
});