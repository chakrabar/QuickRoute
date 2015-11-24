/*! quickRoute v0.7 | (c) 2015 Arghya C | https://github.com/chakrabar */
var router = (function() {
	var routes = [];
	var viewContentHolder = '';
	var useLocalInlineView = true;
	var defaultTitle = '';
	function where(arr, propertyName, value) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].hasOwnProperty(propertyName) && arr[i][propertyName] == value) //hasOwnProperty propertyName in arr[i]
				return arr[i];
		}
		return null;
	}
	function contains(str, search) {
		return typeof str === 'string' && str.indexOf(search) >= 0;
	}
	function hasValue(obj) {
		return (typeof obj !== 'undefined' && obj != null && obj.length != 0);
	}
	function hideAll() {
		for (var i = 0; i < routes.length; i++) {
			$('#' + routes[i]['view']).hide();
		}
	}
	function initializeRoutes() {
		if (typeof jQuery == 'undefined') {
			var jqScript = document.createElement('script');
			jqScript.type = "text/javascript";
			jqScript.src = "https://code.jquery.com/jquery-1.11.3.min.js";
			jqScript.onload = updateRoute;
			document.getElementsByTagName('head')[0].appendChild(jqScript);
		}
		else
			updateRoute();
	}
	function updateRoute() {
		if (routes.length == 0)
			return;		
		var uriHash = window.location.hash;
		var found = false;
		for (var i = 0; i < routes.length; i++) {
			if (uriHash.toLowerCase() == '#' + routes[i]['hash']) { //uriHash.contains(routes[i]['hash'])
				useLocalInlineView ? displayView(routes[i]['view']) : renderView(routes[i]['view']);			
				found = true;
				if (typeof routes[i]['title'] === 'string')
					document.title = routes[i]['title'];
				else
					document.title = defaultTitle;
				break;
			}
		}
		if (!found) {
			useLocalInlineView ? displayView(routes[0]['view']) : renderView(routes[0]['view']);
			document.title = defaultTitle;
		}
	}
	function displayView(elementId) {
		hideAll();
		$('#' + elementId).show();
	}
	function renderView(filePath) {
		try {
			$.get(filePath, function(data) {
				if (data)
					$('#' + viewContentHolder).html(data);
			});
		} catch(e) {
			return null;
		}
	}
	return {
		add: function(key, view, title) {
			if (arguments.length == 2 || arguments.length == 3)
				routes.push({'hash': key.toLowerCase(), 'view': view, 'title': title});
			else if (arguments.length == 1 && typeof key == 'object' && key.hasOwnProperty('hash') && key.hasOwnProperty('view'))
				routes.push(key);
			else
				throw new TypeError('Invalid route configuration passed to add.');
		},
		get: function(key) {
			return where(routes, 'hash', key)['view'];
		},
		update: function(key, view, title) {
			var route = where(routes, 'hash', key);
			if (route != null) {
				route.view = value;
				route.title = title;
			}
		},
		init: function(viewContainerId, isLocalView) {
			if (typeof viewContainerId === 'string')
				viewContentHolder = viewContainerId;
			if (typeof isLocalView === 'boolean')
				useLocalInlineView = isLocalView;
			defaultTitle = document.title;
			initializeRoutes();
		},
		route: function() {
			return updateRoute();
		}
	};   
})();
window.onhashchange = router.route;
