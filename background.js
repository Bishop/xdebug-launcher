window.addEventListener("load", function () {
	var postMessageToActiveTab = function (message) {
		if (tab = opera.extension.tabs.getFocused()) {
			tab.postMessage(message);
		}
	}

	var getToolbar = function () {
		return opera.contexts.toolbar;
	}

	var button = getToolbar().createItem({
		title: "Xdebug",
		icon: "icon_toolbar.png",
		disabled: true,
		onclick: function () {
			postMessageToActiveTab("toggle");
		},
		badge: {
			textContent: "off",
			backgroundColor: "#1e1e1e",
			display: "none"
		}
	});

	getToolbar().addItem(button);

	function checkState() {
		postMessageToActiveTab("query_state");
	}

	function checkHost(url) {
		//opera.postError(url);
		hosts = widget.preferences.urls.split(";");
		for (var i = 0; i < hosts.length; i++) {
			if (new RegExp(hosts[i]).test(url)) {
				return true;
			}
		}
		return false;
	}

	opera.extension.tabs.onfocus = function () {
		var tab = opera.extension.tabs.getFocused(),
			url = tab && tab.url,
			host = url && url.split('/')[2],
			enabled = host && checkHost(host);

		button.disabled = !enabled;
		button.badge.display = enabled ? "block" : "none";

		if (enabled) {
			checkState();
		}
	}

	opera.extension.onmessage = function (event) {
		if (!event.data.type) return;

		switch (event.data.type) {
			case "state":
				button.badge.textContent = event.data.debug ? "on" : "off";
				break;
		}
	}

	opera.extension.onconnect = function (event) {
		postMessageToActiveTab({type: "options", session: widget.preferences.session});
		opera.extension.tabs.onfocus();
	}
}, false);
