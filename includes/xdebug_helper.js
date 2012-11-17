window.addEventListener("load", function(event) {
	var cookie_name = "XDEBUG_SESSION";
	var session_name = "Opera";
	
	var hosts = [];

	function setCookie() {
		document.cookie = cookie_name + "=" + session_name;
	}

	function clearCookie() {
		var date = new Date();
		date.setTime(date.getTime() + (-1*24*60*60*1000));
		document.cookie = cookie_name + "=; expires=" + date.toGMTString();
	}

	function checkCookie() {
		return new RegExp(cookie_name + "=").test(document.cookie);
	}

	function checkHost() {
		for (var i = 0; i < hosts.length; i++) {
			if (new RegExp(hosts[i]).test(document.location.host)) {
				return true;
			}
		}
		return false;
	}

	opera.extension.onmessage = function(event) {
		if (event.data.type && event.data.type == "options") {
			hosts = event.data.urls.split(";");
			session_name = event.data.session;
			return;
		}

		switch (event.data) {
			case "toggle":
				(checkCookie() ? clearCookie : setCookie)();
			case "query_state":
				event.source.postMessage({type: "state", debug: checkCookie(), host: checkHost()});
				break;
		}
	}
}, false);
