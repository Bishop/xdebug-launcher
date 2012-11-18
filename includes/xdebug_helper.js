window.addEventListener("load", function(event) {
	var cookie_name = "XDEBUG_SESSION";
	var session_name = "Opera";
	
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

	opera.extension.onmessage = function(event) {
		if (event.data.type && event.data.type == "options") {
			session_name = event.data.session;
			return;
		}

		switch (event.data) {
			case "toggle":
				(checkCookie() ? clearCookie : setCookie)();
			case "query_state":
				event.source.postMessage({type: "state", debug: checkCookie()});
				break;
		}
	}
}, false);
