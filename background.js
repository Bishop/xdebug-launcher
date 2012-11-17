window.addEventListener("load", function() {
	var button = opera.contexts.toolbar.createItem({
		title: "Xdebug",
		icon: "icon_toolbar.png",
		disabled: true,
		onclick: function() {
			if (tab = opera.extension.tabs.getFocused()) {
				tab.postMessage("toggle");
			}
		},
		badge: {
			textContent: "off",
			backgroundColor: "#1e1e1e",
			display: "none"
		}
	});
	opera.contexts.toolbar.addItem(button);

	function enableButton() {
		if (tab = opera.extension.tabs.getFocused()) {
			tab.postMessage("query_state");
		}
	}

	opera.extension.onmessage = function (event) {
		if (!event.data.type) return;
		switch (event.data.type) {
			case "state":
				button.badge.textContent = event.data.debug ? "on" : "off";
//				opera.postError(event.data.enabled);
				button.badge.display = event.data.host ? "block" : "none";
				button.disabled = !event.data.host;
				break;
		}
	}
	opera.extension.onconnect = function (event) {
		if (tab = opera.extension.tabs.getFocused()) {
//			opera.postError(widget.preferences);
			tab.postMessage({type: "options", urls: widget.preferences.urls, session: widget.preferences.session});
		}
		enableButton();
	}
	opera.extension.tabs.onfocus = enableButton;
	opera.extension.tabs.onblur = enableButton;
}, false);
