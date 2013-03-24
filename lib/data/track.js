var _ = require('underscore');

var tracks = [
	// Blackwood
	{ short: 'BL1', long: 'Blackwood GP', km: 3.307, mi: 2.055, grid: 32, s1: true, s2: true, demo: true, reversible: true },
	{ short: 'BL2', long: 'Blackwood Rallycross', km: 1.839, mi: 1.143, grid: 24, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'BL3', long: 'Blackwood Car Park', km: 0, mi: 0, grid: 16, s1: true, s2: true, demo: false },
	// Southcity
	{ short: 'SO1', long: 'South City Classic', km: 2.033, mi: 1.263, grid: 32 , s1: true, s2: true, demo: false, reversible: true },
	{ short: 'SO2', long: 'South City Sprint 1', km: 2.048, mi: 1.273, grid: 16, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'SO3', long: 'South City Sprint 2', km: 1.334, mi: 0.829, grid: 16, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'SO4', long: 'South City Long', km: 4.029, mi: 2.504, grid: 32, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'SO5', long: 'South City Town Course', km: 3.146, mi: 1.955, grid: 32, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'SO6', long: 'South City Chicane Route', km: 2.917, mi: 1.813, grid: 32, s1: true, s2: true, demo: false, reversible: true },
	// Fern bay
	{ short: 'FE1', long: 'Fern Bay Club', km: 1.584, mi: 0.984, grid: 32, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'FE2', long: 'Fern Bay Green', km: 3.086, mi: 1.918, grid: 32, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'FE3', long: 'Fern Bay Gold', km: 3.514, mi: 2.183, grid: 32, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'FE4', long: 'Fern Bay Black', km: 6.559, mi: 4.076, grid: 32, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'FE5', long: 'Fern Bay Rallycross', km: 2.018, mi: 1.254, grid: 32, s1: true, s2: true, demo: false, reversible: true },
	{ short: 'FE6', long: 'Fern Bay Rallycross Green', km: 0.745, mi: 0.463, grid: 24, s1: true, s2: true, demo: false, reversible: true },
	// Autocross
	{ short: 'AU1', long: 'Autocross', km: 0, mi: 0, grid: 16, s1: true, s2: true, demo: false },
	{ short: 'AU2', long: 'Skidpad', km: 0, mi: 0, grid: 16, s1: true, s2: true, demo: false },
	{ short: 'AU3', long: 'Dragstrip - 2 lane', km: 0.402, mi: 0.250, grid: 2, s1: true, s2: true, demo: false },
	{ short: 'AU4', long: 'Dragstrip - 8 lane', km: 0.402, mi: 0.250, grid: 8, s1: true, s2: true, demo: false },
	// Kyoto Ring
	{ short: 'KY1', long: 'Kyoto Ring Oval', km: 2.980, mi: 1.852, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	{ short: 'KY2', long: 'Kyoto Ring National', km: 5.138, mi: 3.193, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	{ short: 'KY3', long: 'Kyoto Ring GP Long', km: 7.377, mi: 4.584, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	// Westhill
	{ short: 'WE1', long: 'Westhill International', km: 5.180, mi: 3.219, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	// Aston
	{ short: 'AS1', long: 'Aston Cadet', km: 1.870, mi: 1.162, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	{ short: 'AS2', long: 'Aston Club', km: 3.077, mi: 1.912, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	{ short: 'AS3', long: 'Aston National', km: 5.602, mi: 3.481, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	{ short: 'AS4', long: 'Aston Historic', km: 8.089, mi: 5.026, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	{ short: 'AS5', long: 'Aston Grand Prix', km: 8.802, mi: 5.469, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	{ short: 'AS6', long: 'Aston Grand Touring', km: 8.002, mi: 4.972, grid: 32, s1: false, s2: true, demo: false, reversible: true },
	{ short: 'AS7', long: 'Aston North', km: 5.168, mi: 3.211, grid: 32, s1: false, s2: true, demo: false, reversible: true }
];

exports.all = function()
{
	return tracks;
}

exports.findBy = function(criteria)
{
	return _.filter(tracks, criteria);
}

exports.countBy = function(criteria)
{
	return _.countBy(tracks, critiera);
}

exports.randomOneBy = function(criteria)
{
	var t = tracks;
	if (criteria)
		t = _.filter(criteria);

	if (t.length < 0)
		return new Error('No results for criteria!');

	t = _.shuffle(t);

	return t[0];
}
