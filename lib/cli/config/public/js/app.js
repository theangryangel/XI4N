angular.module('config', ['ui.bootstrap'])
.config(function($routeProvider, $locationProvider)
{
	$locationProvider.html5Mode(true);

	$routeProvider
	.when('/', { controller: MainCtrl, templateUrl: '/partial/main.html' })
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
	$scope.data = data;

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

function DialogController($scope, data, dialog)
{
	$scope.data = data;

	$scope.close = function(result)
	{
		if (result && result.talk && result[result.talk])
			$scope.data.config.connections.push(result);
		dialog.close(result);
	}

	$scope.plugins = function()
	{
		var a = [];
		for (var i in $scope.data.config.plugins)
		{
			a.push($scope.data.config.plugins[i].alias);
		}

		return a;
	}
}
