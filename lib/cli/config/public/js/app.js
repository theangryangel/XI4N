angular.module('config', ['ui.bootstrap', 'ngResource'])
.config(function($routeProvider, $locationProvider)
{
	$locationProvider.html5Mode(true);

	$routeProvider
	.when('/', { controller: MainCtrl, templateUrl: '/partial/main.html' })
	.otherwise({ redirectTo: '/' });
})
.factory('AvailablePlugins', function($resource)
{
	return $resource("/plugins");
})
.factory('ConfigVersion', function($http)
{
	return {
		'query': function(cb)
		{
			$http({method: 'GET', url: '/config/version'})
				.success(cb);
		},
		'save': function(data)
		{
		}
	};
})
.factory('ConfigConnections', function($resource)
{
	return $resource("/config/connections");
})
.factory('ConfigPlugins', function($resource)
{
	return $resource("/config/plugins");
});

function MenuCtrl($scope, $http, $dialog, ConfigVersion, AvailablePlugins)
{
	$scope.plugins = [];
	$scope.version = '';

	$scope.load = function()
	{
		AvailablePlugins.query(function(data)
		{
			$scope.plugins = data;
		});

		ConfigVersion.query(function(data)
		{
			$scope.version = data;
		});
	}

	$scope.load();

	$scope.quit = function()
	{
		var title = 'Quit?';
		var msg = 'Are you sure you want to quit?';
		var btns = [{ result:'cancel', label: 'Cancel' }, { result:'ok', label: 'OK', cssClass: 'btn-primary' }];

		$dialog.messageBox(title, msg, btns)
		.open()
		.then(function(result)
		{
			if (result == 'ok')
			{
				$http({ method: 'GET', url: '/quit' });
				alert('You may now close this window!');
			}
		});
	}

	$scope.openDialog = function(template)
	{
		var opts = {
			backdrop: true,
			keyboard: true,
			backdropClick: true,
			templateUrl: template, 
			controller: 'DialogController'
		}

		var d = $dialog.dialog(opts);
		d.open();
	}
}

function MainCtrl($scope)
{
}

function PluginsCtrl($scope, $http, $dialog, ConfigPlugins)
{
	$scope.plugins = [];

	$scope.load = function()
	{
		ConfigPlugins.query(function(data)
		{
			$scope.plugins = data;
		});
	}

	$scope.load();

	$scope.description = function(c)
	{
		return c.path + ' aliased as ' + c.alias;
	}

	$scope.delete = function(i)
	{
	}

	$scope.edit = function(i)
	{
	}
}

function ConnectionsCtrl($scope, $http, $dialog, ConfigConnections)
{
	$scope.connections = [];

	$scope.load = function()
	{
		ConfigConnections.query(function(data)
		{
			$scope.connections = data;
		});
	}

	$scope.load();


	$scope.type = function(c)
	{
		return c.talk;
	}

	$scope.description = function(c)
	{
		var s = '';
		if (c[c.talk].host)
			s += c[c.talk].host;

		if (c[c.talk].port)
			s += ':' + c[c.talk].port;

		return s;
	}

	$scope.delete = function(i)
	{
	}

	$scope.edit = function(i)
	{
	}
}

function DialogController($scope, dialog)
{
	$scope.close = function(result)
	{
		dialog.close(result);
	}

	$scope.plugins = function()
	{
	}
}
