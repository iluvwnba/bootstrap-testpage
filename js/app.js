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

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
	console.log("Created Cookie")
}

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

var obj = {};

function changeDomElement(id, type, value){
	if (type == 'text'){
		$("#"+id).text(value);
	}else if (type == 'image'){
		$("#"+id).attr('src', value)
	}
}

console.log(getCookie('tera-cookie'));
//create cookie if not exists
if (getCookie('tera-cookie') === undefined){
	createCookie("tera-cookie", guid(), 7);
}

//connect to analytics server and send initial data about client
var socket = io.connect( 'localhost:8883');

socket.emit('clientdata', clientinfo);

socket.on('initial-changes', function (data) {
	data.forEach(function (d) {
		changeDomElement(d.id, d.type, d.value);
	})
});


socket.on('grouping-info', function (groupingdata) {
	for (var a = 0; a < groupingdata.length; a++) {
		console.log(groupingdata[a]);
		var meas = groupingdata[a].goal_measure;
		var cid = groupingdata[a].change_id;
		var ctype = groupingdata[a].change_type;
		var cvalue = groupingdata[a].change_value;
		var initfield = groupingdata[a].goal_id.toString();
		$('#'+ initfield).mouseenter(function(){
					obj[initfield] = new Date().getTime();
				})
				.mouseleave(function(){
					var stopTime = new Date().getTime();
					var duration = stopTime - obj[initfield];
					console.log((duration/1000) % 60);
					console.log(meas/10);
					if ((duration/1000) % 60 >= meas/10){
						socket.emit('key-event', {eventtype: 'hover', id:initfield, measure:duration, change_id:cid, change_type:ctype, change_value:cvalue});
					}
				});
	}
});
