angular.module('config', ['ui.bootstrap'])
.config(function($routeProvider, $locationProvider)
{
	$locationProvider.html5Mode(true);

	$routeProvider
	.when('/', { controller: MainCtrl, templateUrl: '/partial/main.html' })
	.when('/plugin/new', { controller: PluginDetailCtrl, templateUrl: '/partial/plugin-detail.html' })
	.otherwise({ redirectTo: '/' });
})
.factory('data', function($http)
{
	var conf = {};
	var plugins = [];

	return {
		config: null,
		plugins: [],
		loaded: function()
		{
			return this.config != null;
		},
		load: function()
		{
			var self = this;
			$http({ method: 'GET', url: '/load' })
			.success(function(data, status, headers, config)
			{
				self.config = data;
			});

			$http({ method: 'GET', url: '/plugins' })
			.success(function(data, status, headers, config)
			{
				self.plugins = data;
			});
		},
		save: function()
		{
			$http.post('/save', this.config);
		}
	};
});

function MenuCtrl($scope, $http, $dialog, data)
{
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

	$scope.ready = function()
	{
		return data.loaded();
	}

	$scope.load = function()
	{
		data.load();
	}

	$scope.save = function()
	{
		data.save();
	}
}

function MainCtrl($scope)
{
}

function PluginsCtrl($scope, $http, $dialog, data)
{
	$scope.data = data;

	$scope.description = function(c)
	{
		return c.path + ' aliased as ' + c.alias;
	}

	$scope.delete = function(i)
	{
		var alias = $scope.data.config.plugins[i].alias;
		for (var i in $scope.data.config.connections)
		{
			var idx = $scope.data.config.connections[i].use.indexOf(alias);
			console.log(idx);
			if (idx < 0)
				continue;

			$scope.data.config.connections[i].use.splice(idx, 1);
		}

		$scope.data.config.plugins.splice(i, 1);
	}

	$scope.edit = function(i)
	{
	}
}

function ConnectionsCtrl($scope, $http, $dialog, data)
{
	$scope.data = data;

	$scope.description = function(c)
	{
		return c.talk + ' to ' + c[c.talk].host;
	}

	$scope.delete = function(i)
	{
		$scope.data.config.connections.splice(i, 1);
	}

	$scope.edit = function(i)
	{
	}
}

function DebugCtrl($scope, data)
{
	$scope.data = data;
}

function PluginDetailCtrl($scope, data)
{
	$scope.data = data;

	$scope.bumfart = function()
	{
		$scope.data.config.bumfart = true;
	}
}
