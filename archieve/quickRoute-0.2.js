/*! quickRoute v0.7 | (c) 2015 Arghya C | https://github.com/chakrabar */
var router = (function() {
	var routes = [];
	//var pageCommonClass = '';
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
			$('#' + routes[i]['elementId']).hide();
		}
	}
	function updateRoute() {
		if (routes.length == 0)
			return;
		hideAll();
		var uriHash = window.location.hash;
		var found = false;
		for (var i = 0; i < routes.length; i++) {
			if (uriHash.toLowerCase() == '#' + routes[i]['hash']) { //uriHash.contains(routes[i]['hash'])
				$('#' + routes[i]['elementId']).show();
				found = true;
				break;
			}
		}
		if (!found) {
			$('#' + routes[0]['elementId']).show();
		}
	}
	return {
		add: function(key, value) {
			routes.push({'hash': key.toLowerCase(), 'elementId': value});
		},
		get: function(key) {
			return where(routes, 'hash', key);
		},
		update: function(key, value) {
			var route = where(routes, 'hash', key);
			if (route != null)
				route.elementId = value;
		},
		init: function() {
			updateRoute(); //window.onload = route;
		},
		route: function() {
			return updateRoute();
		}
	};   
})();
window.onhashchange = router.route;
