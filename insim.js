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

	this.size = 136;
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

	this.size = 72;
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

	this.size = 72;
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

// IS_MST
exports.IS_MST = function()
{
	this._PACK = 'BBBB64s';

	this.size = 60;
	this.type = exports.ISP_MST;
	this.reqi = 0;
	this.zero = 0;

	this.msg = '';
}

util.inherits(exports.IS_MST, exports.IS_Abstract);

// IS_MSX
exports.IS_MSX = function()
{
	this._PACK = 'BBBB96s';

	this.size = 100;
	this.type = exports.ISP_MSX;
	this.reqi = 0;
	this.zero = 0;

	this.msg = '';
}

util.inherits(exports.IS_MSX, exports.IS_Abstract);

// IS_MSL
exports.IS_MSL = function()
{
	this._PACK = 'BBBB128s';

	this.size = 132;
	this.type = exports.ISP_MSL;
	this.reqi = 0;
	this.sound = 0;

	this.msg = '';
}

util.inherits(exports.IS_MSL, exports.IS_Abstract);

// IS_MTC
exports.IS_MTC = function()
{
	// TODO
}

util.inherits(exports.IS_MTC, exports.IS_Abstract);

// IS_SCH
exports.IS_SCH = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_SCH;
	this.reqi = 0;
	this.zero = 0;

	this.charb = 0;
	this.flags = 0;
	this.spare2 = 0;
	this.spare3 = 0;

}

util.inherits(exports.IS_SCH, exports.IS_Abstract);

// IS_ISM
exports.IS_ISM = function()
{
	this._PACK = 'BBBBBBBB32s';

	this.size = 40;
	this.type = exports.ISP_ISM;
	this.reqi = 0;
	this.zero = 0;

	this.host = 0;
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.hname = '';

}

util.inherits(exports.IS_ISM, exports.IS_Abstract);

// IS_VTN
exports.IS_VTN = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_VTN;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.action = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_VTN, exports.IS_Abstract);

// IS_PLC
exports.IS_PLC = function()
{
	this._PACK = 'BBBBBBBBL';

	this.size = 12;
	this.type = exports.ISP_PLC;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.cars = 0;
}

util.inherits(exports.IS_PLC, exports.IS_Abstract);

// IS_RST
exports.IS_RST = function()
{
	this._PACK = 'BBBBBBBB6sBBHHHHHH';

	this.size = 28;
	this.type = exports.ISP_RST;
	this.reqi = 0;
	this.zero = 0;

	this.racelaps = 0;
	this.qualmins = 0;
	this.nump;
	this.timing = 0;

	this.track = '';
	this.weather = 0;
	this.wind = 0;

	this.flags = 0;
	this.numnodes = 0;
	this.finish = 0;
	this.split1 = 0;
	this.split2 = 0;
	this.split3 = 0;
}

util.inherits(exports.IS_RST, exports.IS_Abstract);

// IS_NCN
exports.IS_NCN = function()
{
	this._PACK = 'BBBB24s24sBBBB';

	this.size = 56;
	this.type = exports.ISP_NCN;
	this.reqi = 0;
	this.ucid = 0;

	this.uname = '';
	this.pname = '';

	this.admin = 0;
	this.total = 0;
	this.flags = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_NCN, exports.IS_Abstract);

// IS_CNL
exports.IS_CNL = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_CNL;
	this.reqi = 0;
	this.ucid = 0;

	this.reason = 0;
	this.total = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_CNL, exports.IS_Abstract);

// IS_CPR
exports.IS_CPR = function()
{
	this._PACK = 'BBBB24s8s';

	this.size = 36;
	this.type = exports.ISP_CPR;
	this.reqi = 0;
	this.ucid = 0;

	this.pname = '';
	this.plate = '';
}

util.inherits(exports.IS_CPR, exports.IS_Abstract);

// IS_NPL
exports.IS_NPL = function()
{
	this._PACK = 'BBBBBBH24s8s4s16s4ABBBBlBBBB';

	this.size = 76;
	this.type = exports.ISP_NPL;
	this.reqi = 0;
	this.plid = 0;

	this.ucid = 0;
	this.ptype = 0;
	this.flags = 0;

	this.pname = '';
	this.plate = '';

	this.cname = '';
	this.sname = '';
	this.tyres = 0;
	
	this.h_mass = 0;
	this.h_tres = 0;
	this.model = 0;
	this.pass = 0;

	this.spare = 0;

	this.setf = 0;
	this.nump = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_NPL, exports.IS_Abstract);

// IS_PLP
exports.IS_PLP = function()
{
	this._PACK = 'BBBB';

	this.size = 4;
	this.type = exports.ISP_PLP;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_PLP, exports.IS_Abstract);

// IS_PLL
exports.IS_PLL = function()
{
	this._PACK = 'BBBB';

	this.size = 4;
	this.type = exports.ISP_PLL;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_PLL, exports.IS_Abstract);

// IS_CRS
exports.IS_CRS = function()
{
	this._PACK = 'BBBB';

	this.size = 4;
	this.type = exports.ISP_CRS;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_CRS, exports.IS_Abstract);

// IS_LAP
exports.IS_LAP = function()
{
	this._PACK = 'BBBBLLHHBBBB';

	this.size = 20;
	this.type = exports.ISP_LAP;
	this.reqi = 0;
	this.plid = 0;

	this.ltime = 0;
	this.etime = 0;

	this.lapsdone = 0;
	this.flags = 0;

	this.sp0 = 0;
	this.penalty = 0;
	this.numstops = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_LAP, exports.IS_Abstract);

// IS_SPX
exports.IS_SPX = function()
{
	this._PACK = 'BBBBLLBBBB';

	this.size = 16;
	this.type = exports.ISP_SPX;
	this.reqi = 0;
	this.plid = 0;

	this.stime = 0;
	this.etime = 0;

	this.split = 0;
	this.penalty = 0;
	this.numstops = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_SPX, exports.IS_Abstract);

// IS_PIT
exports.IS_PIT = function()
{
	this._PACK = 'BBBBHHBBBB4ALL';

	this.size = 24;
	this.type = exports.ISP_PIT;
	this.reqi = 0;
	this.plid = 0;

	this.lapsdone = 0;
	this.flags = 0;
	
	this.sp0 = 0;
	this.penalty = 0;
	this.numstops = 0;
	this.sp3 = 0;

	this.tyres = 0;

	this.work = 0;
	this.spare = 0;
}

util.inherits(exports.IS_PIT, exports.IS_Abstract);

// IS_PSF
exports.IS_PSF = function()
{
	this._PACK = 'BBBBLL';

	this.size = 12;
	this.type = exports.ISP_PSF;
	this.reqi = 0;
	this.plid = 0;

	this.stime = 0;
	this.spare = 0;
}

util.inherits(exports.IS_PSF, exports.IS_Abstract);

// IS_PLA
exports.IS_PLA = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_PLA;
	this.reqi = 0;
	this.plid = 0;

	this.face = '';
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_PLA, exports.IS_Abstract);

// IS_CCH
exports.IS_CCH = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_CCH;
	this.reqi = 0;
	this.plid = 0;

	this.camera = '';
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_CCH, exports.IS_Abstract);

// IS_PEN
exports.IS_PEN = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_PEN;
	this.reqi = 0;
	this.plid = 0;

	this.oldpen = '';
	this.newpen = 0;
	this.reason = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_PEN, exports.IS_Abstract);

// IS_TOC
exports.IS_TOC = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_TOC;
	this.reqi = 0;
	this.plid = 0;

	this.olducid = 0;
	this.newucid = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_TOC, exports.IS_Abstract);

// IS_FLG
exports.IS_FLG = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_FLG;
	this.reqi = 0;
	this.plid = 0;

	this.offon = 0;
	this.flag = 0;
	this.carbehind = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_FLG, exports.IS_Abstract);

// IS_PFL
exports.IS_PFL = function()
{
	this._PACK = 'BBBBHH';

	this.size = 8;
	this.type = exports.ISP_PFL;
	this.reqi = 0;
	this.plid = 0;

	this.flags = 0;
	this.spare = 0;
}

util.inherits(exports.IS_PFL, exports.IS_Abstract);

// IS_FIN
exports.IS_FIN = function()
{
	this._PACK = 'BBBBLLBBBBHH';

	this.size = 20;
	this.type = exports.ISP_FIN;
	this.reqi = 0;
	this.plid = 0;

	this.ttime = 0;
	this.btime = 0;

	this.spa = 0;
	this.numstops = 0;
	this.confirm = 0;
	this.spb = 0;

	this.lapsdone = 0;
	this.flags = 0;
}

util.inherits(exports.IS_FIN, exports.IS_Abstract);

// IS_RES
exports.IS_RES = function()
{
	this._PACK = 'BBBB24s24s8s4sLLBBBBHHBBH';

	this.size = 84;
	this.type = exports.ISP_RES;
	this.reqi = 0;
	this.plid = 0;

	this.uname = '';
	this.pname = '';
	this.plate = '';
	this.cname = '';

	this.ttime = 0;
	this.btime = 0;

	this.spa = 0;
	this.numstops = 0;
	this.confirm = 0;
	this.spb = 0;

	this.lapsdone = 0;
	this.flags = 0;

	this.resultnum = 0;
	this.numres = 0;
	this.pseconds = 0;
}

util.inherits(exports.IS_RES, exports.IS_Abstract);

// IS_REO
exports.IS_REO = function()
{
	this._PACK = 'BBBB32A';

	this.size = 36;
	this.type = exports.ISP_REO;
	this.reqi = 0;
	this.nump = 0;

	this.plid = '';
}

util.inherits(exports.IS_REO, exports.IS_Abstract);

// IS_AXI
exports.IS_AXI = function()
{
	this._PACK = 'BBBBBBH32s';

	this.size = 40;
	this.type = exports.ISP_AXI;
	this.reqi = 0;
	this.zero = 0;

	this.axstart = 0;
	this.numcp = 0;
	this.numo = 0;

	this.lname = '';
}

util.inherits(exports.IS_AXI, exports.IS_Abstract);

// IS_AXO
exports.IS_AXO = function()
{
	this._PACK = 'BBBB';

	this.size = 4;
	this.type = exports.ISP_AXO;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_AXO, exports.IS_Abstract);

// IS_AXO
exports.IS_AXO = function()
{
	this._PACK = 'BBBB';

	this.size = 4;
	this.type = exports.ISP_AXO;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_AXO, exports.IS_Abstract);

// IS_NLP
exports.IS_NLP = function()
{
	// TODO
}

util.inherits(exports.IS_NLP, exports.IS_Abstract);

// IS_MCI
exports.IS_MCI = function()
{
	// TODO
}

util.inherits(exports.IS_MCI, exports.IS_Abstract);

// IS_CON
exports.IS_CON = function()
{
	// TODO
}

util.inherits(exports.IS_CON, exports.IS_Abstract);

// IS_OBH
exports.IS_OBH = function()
{
	// TODO
}

util.inherits(exports.IS_OBH, exports.IS_Abstract);

// IS_HLV
exports.IS_HLV = function()
{
	// TODO
}

util.inherits(exports.IS_HLV, exports.IS_Abstract);

// IS_AXM
exports.IS_AXM = function()
{
	// TODO
}

util.inherits(exports.IS_AXM, exports.IS_Abstract);

// IS_SCC
exports.IS_SCC = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_SCC;
	this.reqi = 0;
	this.zero = 0;

	this.viewplid = 0;
	this.ingamecam = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_SCC, exports.IS_Abstract);

// IS_CPP
exports.IS_SCC = function()
{
	this._PACK = 'BBBB3lHHHBBfHH';

	this.size = 32;
	this.type = exports.ISP_SCC;
	this.reqi = 0;
	this.zero = 0;

	this.h = 0;
	this.p = 0;
	this.r = 0;

	this.viewplid = 0;
	this.ingamecam = 0;

	this.fov = 0;

	this.time = 0;
	this.flags = 0;
}

util.inherits(exports.IS_SCC, exports.IS_Abstract);

// IS_RIP
exports.IS_RIP = function()
{
	this._PACK = 'BBBBBBBBLL64s';

	this.size = 80;
	this.type = exports.ISP_RIP;
	this.reqi = 0;
	this.error = 0;

	this.mpr = 0;
	this.paused = 0;
	this.options = 0;
	this.sp3 = 0;

	this.ctime = 0;
	this.ttime = 0;

	this.rname = '';
}

util.inherits(exports.IS_RIP, exports.IS_Abstract);

// IS_SSH
exports.IS_SSH = function()
{
	this._PACK = 'BBBBBBBB32s';

	this.size = 40;
	this.type = exports.ISP_SSH;
	this.reqi = 0;
	this.error = 0;

	this.sp0 = 0;
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.rname = '';
}

util.inherits(exports.IS_SSH, exports.IS_Abstract);

// IS_BFN
exports.IS_BFN = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_BFN;
	this.reqi = 0;
	this.subt = 0;

	this.ucid = 0;
	this.clickid = 0;
	this.inst = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_BFN, exports.IS_Abstract);

// IS_BTN
exports.IS_BTN = function()
{
	// TODO - FINISH - text is not fixed
	this._PACK = 'BBBBBBBBBBBB32s';

	this.size = 12;
	this.type = exports.ISP_BTN;
	this.reqi = 0;
	this.ucid = 0;

	this.clickid = 0;
	this.inst = 0;
	this.bstyle = 0;
	this.typein = 0;

	this.l = 0;
	this.t = 0;
	this.w = 0;
	this.h = 0;

	this.text = '';
}

util.inherits(exports.IS_BTN, exports.IS_Abstract);

// IS_BTC
exports.IS_BTC = function()
{
	this._PACK = 'BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_BTC;
	this.reqi = 0;
	this.ucid = 0;

	this.clickid = 0;
	this.inst = 0;
	this.cflags = 0;
	this.sp3 = 0;

	this.rname = '';
}

util.inherits(exports.IS_BTC, exports.IS_Abstract);

// IS_BTT
exports.IS_BTT = function()
{
	this._PACK = 'BBBBBBBB96s';

	this.size = 104;
	this.type = exports.ISP_BTT;
	this.reqi = 0;
	this.ucid = 0;

	this.clickid = 0;
	this.inst = 0;
	this.typein = 0;
	this.sp3 = 0;

	this.text = '';
}

util.inherits(exports.IS_BTT, exports.IS_Abstract);
