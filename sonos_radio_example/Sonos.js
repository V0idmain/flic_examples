var http = require("http");

function Sonos(ipAddress, port) {
	this.ipAddress = ipAddress;
	this.port = port;
}

function xmlEncode(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

function Response(statusCode, statusMessage, headers, content) {
	this.statusCode = statusCode;
	this.statusMessage = statusMessage;
	this.headers = headers;
	this.content = content;
}

Sonos.prototype.makeRequest = function(soapAction, envelope, callback) {
	http.makeRequest({
		url: "http://" + this.ipAddress + ":" + this.port + "/MediaRenderer/AVTransport/Control",
		method: "POST",
		headers: {"Content-Type": 'text/xml; charset="utf-8"', "SOAPAction": soapAction},
		content: envelope
	}, function(err, res) {
		var response = null
		if (res != null) {
			response = new Response(res.statusCode, res.statusMessage, res.headers, res.content);
		}
		if (callback) callback(err, response);
	});
};

Sonos.prototype.play = function(callback) {
	var soapAction = "urn:schemas-upnp-org:service:AVTransport:1#Play";
	var envelope = '<?xml version="1.0" encoding="utf-8"?>' +
			'<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
			'<s:Body>' +
			'<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">' +
			'<InstanceID>0</InstanceID>' +
			'<Speed>1</Speed>' +
			'</u:Play>' +
			'</s:Body>' +
			'</s:Envelope>';
	this.makeRequest(soapAction, envelope, callback);
}

Sonos.prototype.setRadioUri = function(stationId, callback){
	radioUri = ""
	if (stationId.startsWith("sonos")) {
		// Sonos Radio if stationdId starts with SONOS
		radioUri = "x-sonosapi-radio:" + stationId + "?sid=303&flags=8232&sn=12";
	} else if (stationId.startsWith("SF")) {
		// Pandora if stationId starts with SF
		radioUri = "x-sonosapi-radio:" + stationId + "?sid=236&flags=8296&sn=2";
	} else {
		// TODO: implement other types? or raise exception
	}
	this.setUri(radioUri, callback);
}

Sonos.prototype.setUri = function(uri, callback){
	uri = xmlEncode(uri);
	
	var soapAction = "urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI";
	var envelope = '<?xml version="1.0" encoding="utf-8"?>' +
	'<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
		'<s:Body>' +
			'<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">' +
				'<InstanceID>0</InstanceID>' +
				'<CurrentURI>' + uri + '</CurrentURI>' +
				'<CurrentURIMetaData/>' +
			'</u:SetAVTransportURI>' +
		'</s:Body>' +
	'</s:Envelope>';
	this.makeRequest(soapAction, envelope, callback);
};

module.exports.Sonos = Sonos;