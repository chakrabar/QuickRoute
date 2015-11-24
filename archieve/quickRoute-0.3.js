/*! quickRoute v0.7 | (c) 2015 Arghya C | https://github.com/chakrabar */
var router = (function() {
	var routes = [];
	var viewContentHolder = '';
	var useLocalInlineView = true;
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
	function hideAll() {
		for (var i = 0; i < routes.length; i++) {
			$('#' + routes[i]['viewId']).hide();
		}
	}
	function updateRoute() {
		if (routes.length == 0)
			return;		
		var uriHash = window.location.hash;
		var found = false;
		for (var i = 0; i < routes.length; i++) {
			if (uriHash.toLowerCase() == '#' + routes[i]['hash']) { //uriHash.contains(routes[i]['hash'])
				useLocalInlineView ? displayView(routes[i]['viewId']) : renderView(routes[i]['viewId']);
				found = true;
				break;
			}
		}
		if (!found) {
			useLocalInlineView ? displayView(routes[0]['viewId']) : renderView(routes[0]['viewId']);
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
		add: function(key, value) {
			routes.push({'hash': key.toLowerCase(), 'viewId': value});
		},
		get: function(key) {
			return where(routes, 'hash', key)['viewId'];
		},
		update: function(key, value) {
			var route = where(routes, 'hash', key);
			if (route != null)
				route.viewId = value;
		},
		init: function(viewContainerId, isLocalView) {
			if (typeof viewContainerId === 'string')
				viewContentHolder = viewContainerId;
			if (typeof isLocalView === 'boolean')
				useLocalInlineView = isLocalView;
			updateRoute(); //window.onload = route;
		},
		route: function() {
			return updateRoute();
		}
	};   
})();
window.onhashchange = router.route;
