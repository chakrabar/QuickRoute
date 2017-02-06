var integratorModule = angular.module('integrator', []);

integratorModule.factory('eventServiceBus', function ($rootScope) {
    var events = {};

    return {
        broadcast: function (eventName, data) { //publish
            $rootScope.$broadcast(eventName, data);
        },
        direct: function (scope, eventName, data) { //dispatch
            scope.$broadcast(eventName, data);
        },
        subscribe: function (scope, eventName, handler) {
            scope.$on(eventName, handler);
        }
    };
});

//this is angular agnostic
integratorModule.factory('eventSubscriber', function ($q) {
    var eventCentre = {};
    var removeFromArray = function (array, item) {
        if (array.indexOf(item) != -1) {
            array.splice(array.indexOf(item), 1);
            return true;
        }
        return false;
    };
    return {
        subscribe: function(eventName, handler) {
            if (!eventCentre.hasOwnProperty(eventName))
                eventCentre[eventName] = [handler];
            else
                (eventCentre[eventName]).push(handler);
        },
        unsubscribe: function (eventName, handler) {
            if (eventCentre.hasOwnProperty(eventName))
                removeFromArray(eventCentre[eventName], handler);
        },
        notify: function (eventName, data) {
            if (typeof(eventCentre[eventName]) !== 'undefined') {
                var subscribers = eventCentre[eventName];
                subscribers.forEach(function (handler) {
                    if (typeof(handler) !== 'undefined' && handler != null)
                        handler(data);
                });
            }
        }
    };
});
//to use controller $scope : { ScopeName: 'Name of property for the aggregated postdata, e.g. Counntry', PostData: 'actual data/value e.g. Inida' }
integratorModule.factory('pageDataFactory', function () {
    var data = {};
    var ScopeName = "ScopeName";
    var PostData = "PostData";

    return {
        addData: function (scope) {
            data[scope[ScopeName]] = scope[PostData];
        },
        getData: function () {
            return data;
        }
    };
});