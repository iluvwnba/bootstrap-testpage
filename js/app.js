/**
 * Created by mb on 08/11/2016.
 */

/**
 *
 * Created by mb on 13/07/2016.
 */
var clientinfo={

	timeOpened:new Date(),
	timezone:(new Date()).getTimezoneOffset()/60,

	pageon: window.location.pathname,
	referrer: document.referrer,
	previousSites:history.length,

	browserName :navigator.appName,
	browserEngine: navigator.product,
	browserVersion1a: navigator.appVersion,
	browserVersion1b: navigator.userAgent,
	browserLanguage: navigator.language,
	browserOnline: navigator.onLine,
	browserPlatform: navigator.platform,
	javaEnabled: navigator.javaEnabled(),
	dataCookiesEnable:navigator.cookieEnabled,
	dataCookies1:document.cookie,
	dataCookies2:decodeURIComponent(document.cookie.split(";")),
	dataStorage :localStorage,

	sizeScreenW:screen.width,
	sizeScreenH: screen.height,
	sizeDocW: document.width,
	sizeDocH: document.height,
	sizeInW: innerWidth,
	sizeInH:innerHeight,
	sizeAvailW: screen.availWidth,
	sizeAvailH: screen.availHeight,
	scrColorDepth: screen.colorDepth,
	scrPixelDepth: screen.pixelDepth,

	//TODO understand lat, long
};

function changeDomElement(id, type, value){
	if (type == 'text'){
		$("#"+id).text(value);
	}else if (type == 'image'){
		$("#"+id).attr('src', value)
	}
}

//connect to analytics server and send initial data about client
var socket = io.connect( 'localhost:8883');
console.log(socket);
socket.emit('clientdata', clientinfo);

socket.on('initial-changes', function (data) {
	data.forEach(function (d) {
		changeDomElement(d.id, d.type, d.value);
	})
});