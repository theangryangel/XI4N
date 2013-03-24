var _ = require('underscore');

var vehicles = [
	{ short: 'XFG', long: 'XF GTI', layout: 'Hatchback', drive: 'FWD', kw: 86, bhp: 115, kg: 942, lb: 2076, demo: true, s1: true, s2: true },
	{ short: 'XRG', long: 'XR GT', layout: 'Coupe', drive: 'RWD', kw: 104, bhp: 140, kg: 1150, lb: 2536, demo: true, s1: true, s2: true },
	{ short: 'FBM', long: 'Formula BMW', layout: 'Formula', drive: 'RWD', kw: 105, bhp: 140, kg: 465, lb: 1024, demo: true, s1: true, s2: true },

	{ short: 'XRT', long: 'XR GT Turbo', layout: 'Coupe', drive: 'RWD', kw: 184, bhp: 247, kg: 1223, lb: 2696, demo: false, s1: true, s2: true },
	{ short: 'RB4', long: 'RB4 GT', layout: 'Coupe', drive: 'AWD', kw: 181, bhp: 243, kg: 1210, lb: 2667, demo: false, s1: true, s2: true },
	{ short: 'FXO', long: 'FXO Turbo', layout: 'Coupe', drive: 'FWD', kw: 175, bhp: 234, kg: 1136, lb: 2504, demo: false, s1: true, s2: true },
	{ short: 'LX4', long: 'LX4', layout: 'Roadster', drive: 'RWD', kw: 105, bhp: 140, kg: 499, lb: 1101, demo: false, s1: true, s2: true },
	{ short: 'LX6', long: 'LX6', layout: 'Roadster', drive: 'RWD', kw: 142, bhp: 190, kg: 539, lb: 1188, demo: false, s1: true, s2: true },
	{ short: 'MRT5', long: 'MRT', layout: 'Single seater', drive: 'RWD', kw: 48, bhp: 64, kg: 221, lb: 486, demo: false, s1: true, s2: true },

	{ short: 'UF1', long: 'UF 1000', layout: 'Hatchback', drive: 'FWD', kw: 41, bhp: 55, kg: 600, lb: 1322, demo: false, s1: false, s2: true },
	{ short: 'RAC', long: 'Raceabout', layout: 'Convertible', drive: 'RWD', kw: 183, bhp: 245, kg: 800, lb: 1763, demo: false, s1: false, s2: true },
	{ short: 'FZ5', long: 'FZ50', layout: 'Coupe', drive: 'RWD', kw: 269, bhp: 360, kg: 1380, lb: 3042, demo: false, s1: false, s2: true },
	{ short: 'XFR', long: 'XF GTR', layout: 'Race', drive: 'FWD', kw: 172, bhp: 230, kg: 840, lb: 1851, demo: false, s1: false, s2: true },
	{ short: 'UFR', long: 'UF GTR', layout: 'Race', drive: 'FWD', kw: 134, bhp: 180, kg: 600, lb: 1322, demo: false, s1: false, s2: true },
	{ short: 'FOX', long: 'Formula XR', layout: 'Formula', drive: 'RWD', kw: 142, bhp: 190, kg: 490, lb: 1079, demo: false, s1: false, s2: true },
	{ short: 'FO8', long: 'Formula V8', layout: 'Formula', drive: 'RWD', kw: 335, bhp: 450, kg: 600, lb: 1323, demo: false, s1: false, s2: true },
	{ short: 'BF1', long: 'BMW Sauber F1', layout: 'Formula', drive: 'RWD', kw: 537, bhp: 720, kg: 530, lb: 1169, demo: false, s1: false, s2: true },
	{ short: 'FXR', long: 'FXO GTR', layout: 'Race', drive: 'AWD', kw: 465, bhp: 490, kg: 110, lb: 2425, demo: false, s1: false, s2: true },
	{ short: 'XRR', long: 'XR GTR', layout: 'Race', drive: 'RWD', kw: 465, bhp: 490, kg: 110, lb: 2425, demo: false, s1: false, s2: true },
	{ short: 'FZR', long: 'FZ50 GTR', layout: 'Race', drive: 'RWD', kw: 465, bhp: 490, kg: 110, lb: 2425, demo: false, s1: false, s2: true }
];

exports.all = function()
{
	return vehicles;
}

exports.findBy = function(criteria)
{
	return _.filter(vehicles, criteria);
}

exports.countBy = function(criteria)
{
	return _.countBy(vehicles, critiera);
}

exports.randomOneBy = function(criteria)
{
	var t = vehicles;
	if (criteria)
		t = _.filter(criteria);

	if (t.length < 0)
		return new Error('No results for criteria!');

	t = _.shuffle(t);

	return t[0];
}
