var util = require('util'), jspack = require('jspack').jspack;

// Translating LFS insim.h to jspack as follows -
// char	= c
// byte	= B
// word	= H
// short = h
// unsigned	= L
// int = l
// float = f
// char[16] = 16s

// Version
exports.INSIM_VERSION = 5;

// Packet types;
exports.ISP_NONE = 0;
exports.ISP_ISI = 1;
exports.ISP_VER = 2;
exports.ISP_TINY = 3;
exports.ISP_SMALL = 4;
exports.ISP_STA = 5;
exports.ISP_SCH = 6;
exports.ISP_SFP = 7;
exports.ISP_SCC = 8;
exports.ISP_CPP = 9;
exports.ISP_ISM = 10;
exports.ISP_MSO = 11;
exports.ISP_III = 12;
exports.ISP_MST = 13;
exports.ISP_MTC = 14;
exports.ISP_MOD = 15;
exports.ISP_VTN = 16;
exports.ISP_RST = 17;
exports.ISP_NCN = 18;
exports.ISP_CNL = 19;
exports.ISP_CPR = 20;
exports.ISP_NPL = 21;
exports.ISP_PLP = 22;
exports.ISP_PLL = 23;
exports.ISP_LAP = 24;
exports.ISP_SPX = 25;
exports.ISP_PIT = 26;
exports.ISP_PSF = 27;
exports.ISP_PLA = 28;
exports.ISP_CCH = 29;
exports.ISP_PEN = 30;
exports.ISP_TOC = 31;
exports.ISP_FLG = 32;
exports.ISP_PFL = 33;
exports.ISP_FIN = 34;
exports.ISP_RES = 35;
exports.ISP_REO = 36;
exports.ISP_NLP = 37;
exports.ISP_MCI = 38;
exports.ISP_MSX = 39;
exports.ISP_MSL = 40;
exports.ISP_CRS = 41;
exports.ISP_BFN = 42;
exports.ISP_AXI = 43;
exports.ISP_AXO = 44;
exports.ISP_BTN = 45;
exports.ISP_BTC = 46;
exports.ISP_BTT = 47;
exports.ISP_RIP = 48;
exports.ISP_SSH = 49;
exports.ISP_CON = 50;
exports.ISP_OBH = 51;
exports.ISP_HLV = 52;
exports.ISP_PLC = 53;
exports.ISP_AXM = 54;
exports.ISP_ACR = 55;

// Tiny packet types
exports.TINY_NONE = 0;
exports.TINY_VER = 1;
exports.TINY_CLOSE = 2;
exports.TINY_PING = 3;
exports.TINY_REPLY = 4;
exports.TINY_VTC = 5;
exports.TINY_SCP = 6;
exports.TINY_SST = 7;
exports.TINY_GTH = 8;
exports.TINY_MPE = 9;
exports.TINY_ISM = 10;
exports.TINY_REN = 11;
exports.TINY_CLR = 12;
exports.TINY_NCN = 13;
exports.TINY_NPL = 14;
exports.TINY_RES = 15;
exports.TINY_NLP = 16;
exports.TINY_MCI = 17;
exports.TINY_REO = 18;
exports.TINY_RST = 19;
exports.TINY_AXI = 20;
exports.TINY_AXC = 21;
exports.TINY_RIP = 22;

// Small packet types
exports.SMALL_NONE = 0;
exports.SMALL_SSP = 1;
exports.SMALL_SSG = 2;
exports.SMALL_VTA = 3;
exports.SMALL_TMS = 4;
exports.SMALL_STP = 5;
exports.SMALL_RTP = 6;
exports.SMALL_NLI = 7;

exports.ISP_XLATED = [ 'IS_NONE', 'IS_ISI', 'IS_VER', 'IS_TINY', 'IS_SMALL', 'IS_STA', 'IS_SCH',
'IS_SFP', 'IS_SCC', 'IS_CPP', 'IS_ISM', 'IS_MSO', 'IS_III', 'IS_MST', 'IS_MTC',
'IS_MOD', 'IS_VTN', 'IS_RST', 'IS_NCN', 'IS_CNL', 'IS_CPR', 'IS_NPL', 'IS_PLP',
'IS_PLL', 'IS_LAP', 'IS_SPX', 'IS_PIT', 'IS_PSF', 'IS_PLA', 'IS_CCH', 'IS_PEN',
'IS_TOC', 'IS_FLG', 'IS_PFL', 'IS_FIN', 'IS_RES', 'IS_REO', 'IS_NLP', 'IS_MCI',
'IS_MSX', 'IS_MSL', 'IS_CRS', 'IS_BFN', 'IS_AXI', 'IS_AXO', 'IS_BTN', 'IS_BTC',
'IS_BTT', 'IS_RIP', 'IS_SSH', 'IS_CON', 'IS_OBH', 'IS_HLV', 'IS_PLC', 'IS_AXM',
'IS_ACR' ];

exports.translatePktIdToName = function(id)
{
	var name = exports.ISP_XLATED[id];

	if ((name == undefined) || (name == null))
		return null;

	return name;
}

// IS_Abstract - a base packet. Should not be used
exports.IS_Abstract = function()
{
	var self = this;

	this._PACK = '';

	this.size = 0;
	this.type = exports.ISP_NONE;
}

exports.IS_Abstract.prototype.getProperties = function(values)
{
	var properties = [];
	for(var propertyName in this)
	{
		if (typeof this[propertyName] == 'function')
			continue;

		c = propertyName.charAt(0);
		if (c == '_')
			continue;

		properties.push(propertyName);
	}

	return properties;
}

exports.IS_Abstract.prototype.pack = function(values)
{
	var properties = this.getProperties();
	var values = [];
	for (var i = 0; i < properties.length; i++)
		values.push(this[properties[i]]);

	console.log(values);

	return jspack.Pack(this._PACK, values);
}

exports.IS_Abstract.prototype.unpack = function(buf)
{
	var self = this;

	var data = jspack.Unpack(self._PACK, buf, 0);

	var properties = this.getProperties();
	for (var i = 0; i < properties.length; i++)
		self[properties[i]] = data[i];
}

// IS_ISI
exports.IS_ISI = function()
{
	this._PACK = 'BBBxHHBBH16s16s';

	this.size = 44;

	this.type = exports.ISP_ISI;

	this.reqi = 0;
	this.zero = 0;
	this.udpport = 0;
	this.flags = 0;
	this.sp0 = 0;
	this.prefix;
	this.interval = 0;

	this.admin = '';
	this.iname = '';
}

util.inherits(exports.IS_ISI, exports.IS_Abstract);

// IS_TINY
exports.IS_TINY = function()
{
	this._PACK = 'BBBB';

	this.size = 4;
	this.type = exports.ISP_TINY;
	this.reqi = 0;
	this.subt = 0;
}

util.inherits(exports.IS_TINY, exports.IS_Abstract);

// IS_SMALL
exports.IS_SMALL = function()
{
	this._PACK = 'BBBBL';

	this.size = 4;
	this.type = exports.ISP_TINY;
	this.reqi = 0;
	this.subt = 0;

	this.uval = 0;
}

util.inherits(exports.IS_SMALL, exports.IS_Abstract);

// IS_VER
exports.IS_VER = function()
{
	this._PACK = 'BBBB8s6sH';

	this.size = 20;
	this.type = exports.ISP_VER;
	this.reqi = 0;
	this.zero = 0;
	
	this.version = '';
	this.product = '';
	this.insimver = 0;
}

util.inherits(exports.IS_VER, exports.IS_Abstract);

// IS_STA
exports.IS_STA = function()
{
	this._PACK = 'BBBBiHBBBBBBBBBB6sBB';

	this.size = 28;
	this.type = exports.ISP_STA;
	this.reqi = 0;
	this.zero = 0;
	
	this.replayspeed = 0;
	this.flags = 0;
	this.ingamecam = 0;
	this.viewplid = 0;
	
	this.nump = 0;
	this.numconns = 0;
	this.numfinished = 0;
	this.raceinprog = 0;

	this.qualmins = 0;
	this.racelaps = 0;
	this.spare2 = 0;
	this.spare3 = 0;

	this.track = 0;
	this.weather = 0;
	this.wind = 0;
}

util.inherits(exports.IS_STA, exports.IS_Abstract);

// IS_SFP
exports.IS_SFP = function()
{
	this._PACK = 'BBBBHBB';

	this.size = 8;
	this.type = exports.ISP_SFP;
	this.reqi = 0;
	this.zero = 0;
	
	this.flag = 0;
	this.offon = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_SFP, exports.IS_Abstract);

// IS_MOD
exports.IS_MOD = function()
{
	this._PACK = 'BBBBllll';

	this.size = 20;
	this.type = exports.ISP_MOD;
	this.reqi = 0;
	this.zero = 0;
	
	this.bits16 = 0;
	this.rr = 0;
	this.width = 0;
	this.height = 0;
}

util.inherits(exports.IS_MOD, exports.IS_Abstract);

// IS_MSO
exports.IS_MSO = function()
{
	this._PACK = 'BBBBBBBB128s';

	this.size = 20;
	this.type = exports.ISP_MSO;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.plid = 0;
	this.usertype = 0;
	this.textstart = 0;
	this.msg = '';
	
}

util.inherits(exports.IS_MSO, exports.IS_Abstract);

// IS_III
exports.IS_III = function()
{
	this._PACK = 'BBBBBBBB64s';

	this.size = 20;
	this.type = exports.ISP_III;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.plid = 0;
	this.sp2 = 0;
	this.sp3 = 0;
	this.msg = '';
	
}

util.inherits(exports.IS_III, exports.IS_Abstract);

// IS_ACR
exports.IS_ACR = function()
{
	this._PACK = 'BBBBBBBB64s';

	this.size = 20;
	this.type = exports.ISP_ACR;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.admin = 0;
	this.result = 0;
	this.sp3 = 0;
	this.msg = '';
	
}

util.inherits(exports.IS_ACR, exports.IS_Abstract);
