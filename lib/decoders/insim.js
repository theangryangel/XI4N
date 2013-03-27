"use strict";

var util = require('util'),
	packet = require('./base'),
	struct = require('jspack-buffer');

exports.VERSION = 5;

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

// ISI flags
exports.ISF_RES_0 = 0x01 // bit 0 : spare
exports.ISF_RES_1 = 0x02 // bit 1 : spare
exports.ISF_LOCAL = 0x04 // bit 2 : guest or single player
exports.ISF_MSO_COLS = 0x08 // bit 3 : keep colours in MSO text
exports.ISF_NLP = 0x10	// bit 4 : receive NLP packets
exports.ISF_MCI = 0x20	// bit 5 : receive MCI packets
exports.ISF_CON = 0x40 // bit 6 : receive CON packets
exports.ISF_OBH = 0x80 // bit 7 : receive OBH packets
exports.ISF_HLV = 0x100 // bit 8 : receive HLV packets
exports.ISF_AXM_LOAD = 0x200 // bit 9 : receive AXM when loading a layout
exports.ISF_AXM_EDIT = 0x400 // bit 10 : receive AXM when changing objects

// IS_ISI
exports.IS_ISI = function(buf)
{
	this._fmt = '<BBBBHHBBH16s16s';

	this.size = 44;

	this.type = 1;

	this.reqi = 0;
	this.zero = 0;

	this.udpport = 0;
	this.flags = 0;

	this.sp0 = 0;
	this.prefix = '';
	this.interval = 0;

	this.admin = '';
	this.iname = '';

	this.unpack(buf);
}

util.inherits(exports.IS_ISI, packet);

// IS_VER 
exports.IS_VER = function(buf)
{
	this._fmt = '<BBBB8s6sH';

	this.size = 20;
	this.type = 2;
	this.reqi = 0;
	this.zero = 0;

	this.version = '';
	this.product = '';
	this.insimver = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_VER, packet);

// state flags
exports.ISS_GAME = 1; // in-game
exports.ISS_REPLAY = 2; // in spr
exports.ISS_PAUSED = 4; // paused
exports.ISS_SHIFTU = 8; // in shifu
exports.ISS_16 = 16; // unused
exports.ISS_SHIFTU_FOLLOW = 32; // shiftu follow
exports.ISS_SHIFTU_NO_OPT = 64; // shiftu no options
exports.ISS_SHOW_2D = 128; // showing 2d display?
exports.ISS_FRONT_END = 256; // entry screen
exports.ISS_MULTI = 512; // multiplayer mode
exports.ISS_MPSPEEDUP = 1024; // multiplayer speed up?
exports.ISS_WINDOWED = 2048; // lfs is in a window
exports.ISS_SOUND_MUTE = 4096; // audio is muted
exports.ISS_VIEW_OVERRIDE = 8192; // custom view
exports.ISS_VISIBLE = 16384; // insim buttons visible

exports.IS_TINY = function(buf)
{
	this._fmt = '<BBBB';

	this.size = 4;
	this.type = 3;
	this.reqi = 0;
	this.subt = 0;

	this.unpack(buf);
};

util.inherits(exports.IS_TINY, packet);

exports.IS_SMALL = function(buf)
{
	this._fmt = '<BBBBL';

	this.size = 8;
	this.type = 4;
	this.reqi = 0;
	this.subt = 0;

	this.uval = 0;

	this.unpack(buf);
};

util.inherits(exports.IS_SMALL, packet);

// IS_STA 
exports.IS_STA = function(buf)
{
	this._fmt = '<BBBBiHBBBBBBBBBB6sBB';

	this.size = 28;
	this.type = 5;
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

	this.unpack(buf);
}

util.inherits(exports.IS_STA, packet);

// IS_SFP 
exports.IS_SFP = function(buf)
{
	this._fmt = '<BBBBHBB';

	this.size = 8;
	this.type = 7;
	this.reqi = 0;
	this.zero = 0;

	this.flag = 0;
	this.offon = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_SFP, packet);

// IS_MOD 
exports.IS_MOD = function(buf)
{
	this._fmt = '<BBBBllll';

	this.size = 20;
	this.type = 15;
	this.reqi = 0;
	this.zero = 0;

	this.bits16 = 0;
	this.rr = 0;
	this.width = 0;
	this.height = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_MOD, packet);

// IS_MSO 

exports.MSO_SYSTEM = 0; // system message
exports.MSO_USER = 1; // normal visible user message
exports.MSO_PREFIX = 2; // hidden message starting with special prefix (see ISI)
exports.MSO_O = 3; // hidden message typed on local pc with /o command

exports.IS_MSO = function(buf)
{
	this._fmt = '<BBBBBBBB128s';

	this.size = 136;
	this.type = 11;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.plid = 0;
	this.usertype = 0;
	this.textstart = 0;
	this.msg = '';

	this.unpack(buf);
}

util.inherits(exports.IS_MSO, packet);

// IS_III 
exports.IS_III = function(buf)
{
	this._fmt = '<BBBBBBBB64s';

	this.size = 72;
	this.type = 12;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.plid = 0;
	this.sp2 = 0;
	this.sp3 = 0;
	this.msg = '';

	this.unpack(buf);
}

util.inherits(exports.IS_III, packet);

// IS_ACR 
exports.IS_ACR = function(buf)
{
	this._fmt = '<BBBBBBBB64s';

	this.size = 72;
	this.type = 55;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.admin = 0;
	this.result = 0;
	this.sp3 = 0;
	this.msg = '';

	this.unpack(buf);
}

util.inherits(exports.IS_ACR, packet);

// IS_MST 
exports.IS_MST = function(buf)
{
	this._fmt = '<BBBB64s';

	this.size = 68;
	this.type = 13;
	this.reqi = 0;
	this.zero = 0;

	this.msg = '';

	this.unpack(buf);
}

util.inherits(exports.IS_MST, packet);

// IS_MSX 
exports.IS_MSX = function(buf)
{
	this._fmt = '<BBBB96s';

	this.size = 100;
	this.type = 39;
	this.reqi = 0;
	this.zero = 0;

	this.msg = '';

	this.unpack(buf);
}

util.inherits(exports.IS_MSX, packet);

// Message Sounds (for Sound byte)
exports.SND_SILENT = 0;
exports.SND_MESSAGE = 1;
exports.SND_SYSMESSAGE = 2;
exports.SND_INVALIDKEY = 3;
exports.SND_ERROR = 4;
exports.SND_NUM = 5;

// IS_MSL 
exports.IS_MSL = function(buf)
{
	this._fmt = '<BBBB128s';

	this.size = 132;
	this.type = 40;
	this.reqi = 0;
	this.sound = 0;

	this.msg = '';

	this.unpack(buf);
}

util.inherits(exports.IS_MSL, packet);

// IS_MTC 
exports.IS_MTC = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 14;
	this.reqi = 0;
	this.sound = 0;

	this.ucid = 0;
	this.plid = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.text = '';

	this.unpack(buf);
}

util.inherits(exports.IS_MTC, packet);

exports.IS_MTC.prototype.pack = function(values)
{
	var len = this.text.length + 1;

	if (len >= 128)
		len = 128;

	if ((len % 4) != 0)
		len += 4 - (len % 4);

	this._fmt += len.toString() + 's';

	this.size += len;

	var properties = this.getProperties();
	var values = [];
	for (i = 0; i < properties.length; i++)
		values.push(this[properties[i]]);

	return struct.pack(this._fmt, values);
}

// IS_SCH 
exports.IS_SCH = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 6;
	this.reqi = 0;
	this.zero = 0;

	this.charb = 0;
	this.flags = 0;
	this.spare2 = 0;
	this.spare3 = 0;


	this.unpack(buf);
}

util.inherits(exports.IS_SCH, packet);

// IS_ISM 
exports.IS_ISM = function(buf)
{
	this._fmt = '<BBBBBBBB32s';

	this.size = 40;
	this.type = 10;
	this.reqi = 0;
	this.zero = 0;

	this.host = 0;
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.hname = '';

	this.unpack(buf);
}

util.inherits(exports.IS_ISM, packet);

// The Vote Actions
exports.VOTE_NONE = 0 // no vote
exports.VOTE_END = 1; // end race
exports.VOTE_RESTART = 2 ; // restart
exports.VOTE_QUALIFY = 3; // qualify
exports.VOTE_NUM = 4;

// IS_VTN 
exports.IS_VTN = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 16;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.action = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_VTN, packet);

// IDs for allowed cars field for IS_PLC
// Both short and long names for convenience
exports.XF_GTI = exports.XFG = 1
exports.XR_GT = exports.XRG = 2
exports.XR_GT_TURBO = exports.XRT = 4
exports.RB4_GT = exports.RB4 = 8
exports.FXO_TURBO = exports.FXO = 0x10
exports.LX4 = 0x20
exports.LX6	= 0x40
exports.MRT5 = 0x80
exports.UF_1000 = exports.UF1 = 0x100
exports.RACEABOUT = exports.RAC = 0x200
exports.FZ50 = exports.FZ5 = 0x400
exports.FORMULA_XR = exports.FOX = 0x800
exports.XF_GTR = exports.XFR = 0x1000
exports.UF_GTR = exports.UFR = 0x2000
exports.FORMULA_V8 = exports.FO8 = 0x4000
exports.FXO_GTR = exports.FXR = 0x8000
exports.XR_GTR = exports.XRR = 0x10000
exports.FZ50_GTR = exports.FZR = 0x20000
exports.BMW_SAUBER_F106 = exports.BF1 = 0x40000
exports.FORMULA_BMW_FB02 = exports.FBM = 0x80000

// IS_PLC 
exports.IS_PLC = function(buf)
{
	this._fmt = '<BBBBBBBBL';

	this.size = 12;
	this.type = 53;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.cars = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_PLC, packet);

// IS_RST 
exports.IS_RST = function(buf)
{
	this._fmt = '<BBBBBBBB6sBBHHHHHH';

	this.size = 28;
	this.type = 17;
	this.reqi = 0;
	this.zero = 0;

	this.racelaps = 0;
	this.qualmins = 0;
	this.nump = 0;
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

	this.unpack(buf);
}

util.inherits(exports.IS_RST, packet);

// IS_NCN 
exports.IS_NCN = function(buf)
{
	this._fmt = '<BBBB24s24sBBBB';

	this.size = 56;
	this.type = 18;
	this.reqi = 0;
	this.ucid = 0;

	this.uname = '';
	this.pname = '';

	this.admin = 0;
	this.total = 0;
	this.flags = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_NCN, packet);

// IS_CNL 
exports.IS_CNL = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 19;
	this.reqi = 0;
	this.ucid = 0;

	this.reason = 0;
	this.total = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_CNL, packet);

// IS_CPR 
exports.IS_CPR = function(buf)
{
	this._fmt = '<BBBB24s8s';

	this.size = 36;
	this.type = 20;
	this.reqi = 0;
	this.ucid = 0;

	this.pname = '';
	this.plate = '';

	this.unpack(buf);
}

util.inherits(exports.IS_CPR, packet);

// IS_NPL 
exports.IS_NPL = function(buf)
{
	this._fmt = '<BBBBBBH24s8s4s16s4ABBBBlBBBB';

	this.size = 76;
	this.type = 21;
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

	this.unpack(buf);
}

util.inherits(exports.IS_NPL, packet);

// IS_PLP 
exports.IS_PLP = function(buf)
{
	this._fmt = '<BBBB';

	this.size = 4;
	this.type = 22;
	this.reqi = 0;
	this.plid = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_PLP, packet);

// IS_PLL 
exports.IS_PLL = function(buf)
{
	this._fmt = '<BBBB';

	this.size = 4;
	this.type = 23;
	this.reqi = 0;
	this.plid = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_PLL, packet);

// IS_CRS 
exports.IS_CRS = function(buf)
{
	this._fmt = '<BBBB';

	this.size = 4;
	this.type = 41;
	this.reqi = 0;
	this.plid = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_CRS, packet);

// IS_LAP 
exports.IS_LAP = function(buf)
{
	this._fmt = '<BBBBLLHHBBBB';

	this.size = 20;
	this.type = 24;
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

	this.unpack(buf);
}

util.inherits(exports.IS_LAP, packet);

// IS_SPX 
exports.IS_SPX = function(buf)
{
	this._fmt = '<BBBBLLBBBB';

	this.size = 16;
	this.type = 25;
	this.reqi = 0;
	this.plid = 0;

	this.stime = 0;
	this.etime = 0;

	this.split = 0;
	this.penalty = 0;
	this.numstops = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_SPX, packet);

// IS_PIT 
exports.IS_PIT = function(buf)
{
	this._fmt = '<BBBBHHBBBB4ALL';

	this.size = 24;
	this.type = 26;
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

	this.unpack(buf);
}

util.inherits(exports.IS_PIT, packet);

// IS_PSF 
exports.IS_PSF = function(buf)
{
	this._fmt = '<BBBBLL';

	this.size = 12;
	this.type = 27;
	this.reqi = 0;
	this.plid = 0;

	this.stime = 0;
	this.spare = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_PSF, packet);

exports.PITLANE_EXIT = 0; // 0 - left pit lane
exports.PITLANE_ENTER = 1; // 1 - entered pit lane
exports.PITLANE_NO_PURPOSE = 2; // 2 - entered for no purpose
exports.PITLANE_DT = 3; // 3 - entered for drive-through
exports.PITLANE_SG = 4; // 4 - entered for stop-go

// IS_PLA 
exports.IS_PLA = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 28;
	this.reqi = 0;
	this.plid = 0;

	this.fact = 0;
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_PLA, packet);

// IS_CCH 
exports.IS_CCH = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 29;
	this.reqi = 0;
	this.plid = 0;

	this.camera = '';
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_CCH, packet);

// IS_PEN 
exports.IS_PEN = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 30;
	this.reqi = 0;
	this.plid = 0;

	this.oldpen = '';
	this.newpen = 0;
	this.reason = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_PEN, packet);

// IS_TOC 
exports.IS_TOC = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 31;
	this.reqi = 0;
	this.plid = 0;

	this.olducid = 0;
	this.newucid = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_TOC, packet);

exports.FLG_BLUE = 1; // given
exports.FLG_YELLOW = 1; // receiving

// IS_FLG 
exports.IS_FLG = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 32;
	this.reqi = 0;
	this.plid = 0;

	this.offon = 0;
	this.flag = 0;
	this.carbehind = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_FLG, packet);

// IS_PFL 
exports.IS_PFL = function(buf)
{
	this._fmt = '<BBBBHH';

	this.size = 8;
	this.type = 33;
	this.reqi = 0;
	this.plid = 0;

	this.flags = 0;
	this.spare = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_PFL, packet);

// IS_FIN 
exports.IS_FIN = function(buf)
{
	this._fmt = '<BBBBLLBBBBHH';

	this.size = 20;
	this.type = 34;
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

	this.unpack(buf);
}

util.inherits(exports.IS_FIN, packet);

exports.CONF_MENTIONED = 1;
exports.CONF_CONFIRMED = 2;
exports.CONF_PENALTY_DT	= 4;
exports.CONF_PENALTY_SG	= 8;
exports.CONF_PENALTY_30	= 16;
exports.CONF_PENALTY_45	= 32;
exports.CONF_DID_NOT_PIT = 64;

exports.CONF_DISQ = (exports.CONF_PENALTY_DT | exports.CONF_PENALTY_SG | exports.CONF_DID_NOT_PIT);
exports.CONF_TIME = (exports.CONF_PENALTY_30 | exports.CONF_PENALTY_45);

// IS_RES 
exports.IS_RES = function(buf)
{
	this._fmt = '<BBBB24s24s8s4sLLBBBBHHBBH';

	this.size = 84;
	this.type = 35;
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

	this.unpack(buf);
}

util.inherits(exports.IS_RES, packet);

// IS_REO 
exports.IS_REO = function(buf)
{
	this._fmt = '<BBBB32A';

	this.size = 36;
	this.type = 36;
	this.reqi = 0;
	this.nump = 0;

	this.plid = [];

	this.unpack(buf);
}

util.inherits(exports.IS_REO, packet);

// IS_AXI 
exports.IS_AXI = function(buf)
{
	this._fmt = '<BBBBBBH32s';

	this.size = 40;
	this.type = 43;
	this.reqi = 0;
	this.zero = 0;

	this.axstart = 0;
	this.numcp = 0;
	this.numo = 0;

	this.lname = '';

	this.unpack(buf);
}

util.inherits(exports.IS_AXI, packet);

// IS_AXO 
exports.IS_AXO = function(buf)
{
	this._fmt = '<BBBB';

	this.size = 4;
	this.type = 44;
	this.reqi = 0;
	this.plid = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_AXO, packet);

// IS_AXO 
exports.IS_AXO = function(buf)
{
	this._fmt = '<BBBB';

	this.size = 4;
	this.type = 44;
	this.reqi = 0;
	this.plid = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_AXO, packet);

// NodeLap
exports.IS_NODELAP = function(buf)
{
	this._fmt = '<HHBB';

	this.node = 0;
	this.lap = 0;
	this.plid = 0;
	this.position = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_NODELAP, packet);

// IS_NLP 
exports.IS_NLP = function(buf)
{
	this.size = 0;
	this.type = 37;
	this.reqi = 0;
	this.nump = 0;

	this.info = [];

	this.unpack(buf);
}

util.inherits(exports.IS_NLP, packet);

/*
IS_NLP.prototype.unpack = function(buf)
{
	var self = this;

	// Base properties
	var data = struct.unpack(self._fmt, buf, 0);

	var properties = this.getProperties();
	for (i = 0; i < properties.length; i++)
	{
		if (properties[i] == "info")
			continue;

		self[properties[i]] = data[i];
	}

	// NodeLap unpacking
	for(i = 0; i < self.numc; i++)
	{
		// Next packet start position
		var start = 4 + (i * 6);
		var tbuf = buf.slice(start, (start + 28));

		var c = new IS_NODELAP;
		c.unpack(tbuf);

		self.info.push(c);
	}
}
*/

// CompCar

// CompCar info flags
exports.CCI_BLUE = 1;
exports.CCI_YELLOW = 2;
exports.CCI_LAG = 32;
exports.CCI_FIRST = 64;
exports.CCI_LAST = 128;

exports.IS_COMPCAR = function(buf)
{
	this._fmt = '<HHBBBBlllHHHh';

	this.node = 0;
	this.lap = 0;
	this.plid = 0;
	this.position = 0;
	this.info = 0;
	this.sp3 = 0;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.speed = 0;
	this.direction = 0;
	this.heading = 0;
	this.angvel = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_COMPCAR, packet);

// IS_MCI 
exports.IS_MCI = function(buf)
{
	this._fmt = '<BBBB';

	// Variable size packet
	// 4 + (numc * 28)
	this.size = 0;
	this.type = 38;
	this.reqi = 0;
	this.numc = 0;

	this.compcar = [];

	this.unpack(buf);
}

util.inherits(exports.IS_MCI, packet);

exports.IS_MCI.prototype.pack = function()
{
	throw new Error('Unsupported at this time');
}

exports.IS_MCI.prototype.unpack = function(buf)
{
	var self = this,
		payload = buf;

	if (typeof payload != 'ArrayBuffer')
		payload = this.toArrayBuffer(buf);

	// Base properties
	var data = struct.unpack(self._fmt, payload, 0);

	var properties = this.getProperties();
	for (i = 0; i < properties.length; i++)
	{
		if (properties[i] == "compcar")
			continue;

		self[properties[i]] = data[i];
	}

	// Compcar unpacking
	for(var i = 0; i < self.numc; i++)
	{
		// Next packet start position
		var start = 4 + (i * 28);
		var tbuf = buf.slice(start, (start + 28));

		var c = new exports.IS_COMPCAR(tbuf);

		self.compcar.push(c);
	}
}

// IS_CARCONTACT 
exports.IS_CARCONTACT = function(buf)
{
	this._fmt = '<BBBcBBBBBBcchh';

	this.plid = 0;
	this.info = 0;
	this.sp2 = 0;
	this.steer = 0;

	this.thrbrk = 0;
	this.cluhan = 0;
	this.gearsp = 0;
	this.speed = 0;

	this.direction = 0;
	this.heading = 0;
	this.accelf = 0;
	this.accelr = 0;

	this.x = 0;
	this.y = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_CARCONTACT, packet);

// IS_CON 
exports.IS_CON = function(buf)
{
	this._fmt = '<BBBB';

	this.size = 40;
	this.type = 50;
	this.reqi = 0;
	this.numc = 0;

	this.spclose = 0;
	this.time = 0;

	this.a = null;
	this.b = null;

	this.unpack(buf);
}

util.inherits(exports.IS_CON, packet);

exports.IS_CON.prototype.unpack = function(buf)
{
	var self = this,
		payload = buf;		

	if (typeof payload != 'ArrayBuffer')
		payload = this.toArrayBuffer(buf);

	// Base properties
	var data = struct.unpack(self._fmt, payload, 0);
	var properties = this.getProperties();
	var start = 8;

	for (var i = 0; i < properties.length; i++)
	{
		if (properties[i] == "a" || properties[i] == "b")
		{
			var tbuf = buf.slice(start, (start + 16));
			var c = new exports.IS_CARCONTACT;
			c.unpack(tbuf);
			self[properties[i]] = c;

			start += 16;
			continue;
		}

		self[properties[i]] = data[i];
	}
}

exports.IS_CARCONTOBJ = function(buf)
{
	this._fmt = '<BBBBhh';

	this.direction = 0;
	this.heading = 0;
	this.speed = 0;
	this.sp3 = 0;

	this.x = 0;
	this.y = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_CARCONTOBJ, packet);

// IS_OBH OBHFlags
exports.OBH_LAYOUT = 1;
exports.OBH_CAN_MOVE = 2;
exports.OBH_WAS_MOVING = 4;
exports.OBH_ON_SPOT = 8;

// IS_OBH 
exports.IS_OBH = function(buf)
{
	// TODO - FINISH
	this._fmt = '<BBBBHH';

	this.size = 24;
	this.type = 51;
	this.reqi = 0;
	this.plid = 0;

	this.spclose = 0;
	this.time = 0;

	this.c = null;

	this.x = 0;
	this.y = 0;

	this.sp0;
	this.sp1 = 0;

	this.index = 0;
	this.obhflags = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_OBH, packet);

// IS_HLV 
exports.IS_HLV = function(buf)
{
	this._fmt = '<BBBBBBH';

	this.size = 16;
	this.type = 52;
	this.reqi = 0;
	this.plid = 0;

	this.hlvc = 0;
	this.sp1 = 0;
	this.time = 0;

	this.c = null;

	this.unpack(buf);
}

util.inherits(exports.IS_HLV, packet);

exports.HLVC_GROUND = 0;
exports.HLVC_WALL = 1;
exports.HLVC_SPEED = 2;

/*
IS_HLV.prototype.unpack = function(buf)
{
	var self = this;

	// Base properties
	var data = struct.unpack(self._fmt, buf, 0);
	var properties = this.getProperties();
	var start = 8;

	for (i = 0; i < properties.length; i++)
	{
		if (properties[i] == "c")
		{
			var tbuf = buf.slice(start, (start + 8));
			var c = new IS_CARCONTOBJ;
			c.unpack(tbuf);
			self[properties[i]] = c;

			start += 16;
			continue;
		}

		self[properties[i]] = data[i];
	}

	this.unpack(buf);
}
*/

// ObjectInfo
exports.IS_OBJECTINFO = function(buf)
{
	this._fmt = '<hhcBBB';

	this.x = 0;
	this.y = 0;
	this.zchar = 0;
	this.flags = 0;
	this.index = 0;
	this.heading = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_OBJECTINFO, packet);

// IS_AXM pmoaction flags
exports.PMO_LOADING_FILE = 0;
exports.PMO_ADD_OBJECTS = 1;
exports.PMO_DEL_OBJECTS = 2;
exports.PMO_CLEAR_ALL = 3;
exports.PMO_NUM = 4;

// IS_AXM 
exports.IS_AXM = function(buf)
{
	this._fmt = '<hhcBBB';

	this.size = 0;
	this.type = 54;
	this.reqi = 0;
	this.numo = 0;

	this.ucid = 0;
	this.pmoaction = 0;
	this.pmoflags = 0;
	this.sp3 = 0;

	this.info = [];

	this.unpack(buf);
}

util.inherits(exports.IS_AXM, packet);

/*
IS_AXM.prototype.unpack = function(buf)
{
	var self = this;

	// Base properties
	var data = struct.unpack(self._fmt, buf, 0);
	var properties = this.getProperties();
	var start = 8;

	for (i = 0; i < properties.length; i++)
	{
		if (properties[i] == "info")
			continue;

		self[properties[i]] = data[i];
	}

	// ObjectInfo unpacking
	for(i = 0; i < self.numo; i++)
	{
		// Next packet start position
		var start = 8 + (i * 8);
		var tbuf = buf.slice(start, (start + 28));

		var c = new IS_OBJECTINFO;
		c.unpack(tbuf);

		self.info.push(c);
	}
}
*/

exports.VIEW_FOLLOW = 0; // arcade
exports.VIEW_HELI = 1; //helicopter
exports.VIEW_CAM = 2; // tv camera
exports.VIEW_DRIVER = 3; // cockpit
exports.VIEW_CUSTOM = 4; // - custom

// IS_SCC 
exports.IS_SCC = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 8;
	this.reqi = 0;
	this.zero = 0;

	// set ingamecam or viewplid to 255 to leave that option unchanged
	this.viewplid = 255;
	this.ingamecam = 255;

	this.sp2 = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_SCC, packet);

// IS_CPP 
exports.IS_CPP = function(buf)
{
	this._fmt = '<BBBB3lHHHBBfHH';

	this.size = 32;
	this.type = 8;
	this.reqi = 0;
	this.zero = 0;

	this.h = 0;
	this.p = 0;
	this.r = 0;

	this.viewplid = 0;
	this.ingamecam = 0;

	this.fov = 0;

	this.time = 0;

	// valid state flags that can be set -
	// ISS_SHIFTU - shiftu mode
	// ISS_SHIFTU_FOLLOW - shiftu follow view
	// ISS_VIEW_OVERRIDE - override user view
	this.flags = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_CPP, packet);

// IS_RIP 
exports.IS_RIP = function(buf)
{
	this._fmt = '<BBBBBBBBLL64s';

	this.size = 80;
	this.type = 48;
	this.reqi = 0;
	this.error = 0;

	this.mpr = 0;
	this.paused = 0;
	this.options = 0;
	this.sp3 = 0;

	this.ctime = 0;
	this.ttime = 0;

	this.rname = '';

	this.unpack(buf);
}

util.inherits(exports.IS_RIP, packet);

// IS_SSH 
exports.IS_SSH = function(buf)
{
	this._fmt = '<BBBBBBBB32s';

	this.size = 40;
	this.type = 49;
	this.reqi = 0;
	this.error = 0;

	this.sp0 = 0;
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.rname = '';

	this.unpack(buf);
}

util.inherits(exports.IS_SSH, packet);

// IS_BFN subt
exports.BFN_DEL_BTN = 0;
exports.BFN_CLEAR = 1;
exports.BFN_USER_CLEAR = 2;
exports.BFN_REQUEST = 3;

// IS_BFN 
exports.IS_BFN = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 42;
	this.reqi = 0;
	this.subt = 0;

	this.ucid = 0;
	this.clickid = 0;
	this.inst = 0;
	this.sp3 = 0;

	this.unpack(buf);
}

util.inherits(exports.IS_BFN, packet);

// Styles for buttons
exports.ISB_C1 = 1; // standard button
exports.ISB_C2 = 2; // interface colour
exports.ISB_C4 = 4; // TODO
exports.ISB_CLICK = 8; // click 
exports.ISB_LIGHT = 16; // light button
exports.ISB_DARK = 32; // dark button
exports.ISB_LEFT = 64; // left align text
exports.ISB_RIGHT = 128; // right align text

// Colors and their "normal" LFS usage
exports.ISB_COL_LIGHTGREY = 0; // not user editable
exports.ISB_COL_YELLOW = 1; // title colour
exports.ISB_COL_BLACK = 2; // unselected text
exports.ISB_COL_WHITE = 3; // selectex text
exports.ISB_COL_GREEN = 4; // ok
exports.ISB_COL_RED = 5; // cancel
exports.ISB_COL_PALEBLUE = 6; // text string
exports.ISB_COL_GREY = 7; // unavailable

// IS_BTN 
exports.IS_BTN = function(buf)
{
	this._fmt = '<BBBBBBBBBBBB';

	this.size = 12;
	this.type = 45;
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

	this.unpack(buf);
}

util.inherits(exports.IS_BTN, packet);

exports.IS_BTN.prototype.pack = function(values)
{
	var len = this.text.length + 1;

	if (len > 240)
		len = 240;

	if ((len % 4) != 0)
		len += 4 - (len % 4);

	this._fmt += len.toString() + 's';

	this.size += len;

	var properties = this.getProperties();
	var values = [];
	for (i = 0; i < properties.length; i++)
		values.push(this[properties[i]]);

	return struct.pack(this._fmt, values);
}

// IS_BTC  click types
exports.ISB_LMB = 1; // left mouse button click
exports.ISB_RMB = 2; // right mount button click
exports.ISB_CTRL = 3; // ctrl + left button click
exports.ISB_SHIFT = 4; // shift + left button click

// IS_BTC 
exports.IS_BTC = function(buf)
{
	this._fmt = '<BBBBBBBB';

	this.size = 8;
	this.type = 46;
	this.reqi = 0;
	this.ucid = 0;

	this.clickid = 0;
	this.inst = 0;
	this.cflags = 0;
	this.sp3 = 0;

	this.rname = '';

	this.unpack(buf);
}

util.inherits(exports.IS_BTC, packet);

// IS_BTT 
exports.IS_BTT = function(buf)
{
	this._fmt = '<BBBBBBBB96s';

	this.size = 104;
	this.type = 47;
	this.reqi = 0;
	this.ucid = 0;

	this.clickid = 0;
	this.inst = 0;
	this.typein = 0;
	this.sp3 = 0;

	this.text = '';

	this.unpack(buf);
}

util.inherits(exports.IS_BTT, packet);

/**
 * A cheats way to translate ID to packet object name. The array key for the
 * corresponding packet name MUST match the actual ID of the packet. Because the
 * packets are sequential we dont need to create this with specific keys,
 * however should the packet IDs ever skip a value this will need to be changed.
 */
exports.XLATE = [ 'IS_NONE', 'IS_ISI', 'IS_VER', 'IS_TINY', 'IS_SMALL', 'IS_STA', 'IS_SCH',
'IS_SFP', 'IS_SCC', 'IS_CPP', 'IS_ISM', 'IS_MSO', 'IS_III', 'IS_MST', 'IS_MTC',
'IS_MOD', 'IS_VTN', 'IS_RST', 'IS_NCN', 'IS_CNL', 'IS_CPR', 'IS_NPL', 'IS_PLP',
'IS_PLL', 'IS_LAP', 'IS_SPX', 'IS_PIT', 'IS_PSF', 'IS_PLA', 'IS_CCH', 'IS_PEN',
'IS_TOC', 'IS_FLG', 'IS_PFL', 'IS_FIN', 'IS_RES', 'IS_REO', 'IS_NLP', 'IS_MCI',
'IS_MSX', 'IS_MSL', 'IS_CRS', 'IS_BFN', 'IS_AXI', 'IS_AXO', 'IS_BTN', 'IS_BTC',
'IS_BTT', 'IS_RIP', 'IS_SSH', 'IS_CON', 'IS_OBH', 'IS_HLV', 'IS_PLC', 'IS_AXM',
'IS_ACR' ];

exports.getName = function(id)
{
	var name = exports.XLATE[id];

	if ((name == undefined) || (name == null))
		return null;

	return name;
};

exports.getId = function(name)
{
	for (var i in exports.XLATE)
	{
		if (exports.XLATE[i] == name)
			return i;
	}

	return -1;
}

exports.decode = function(data)
{
	var id = data.readUInt8(1);

	if (id < 1)
		return;

	var name = exports.getName(id);
	if (name == null)
		return null;

	return new exports[name](data);
}
