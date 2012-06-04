"use strict";

(function(exports)
{

/**
 * Module dependencies.
 */
var util = require('util'),
	sillystring = require('./strings'),
	jspack = require('jspack').jspack,
	net = require('net'), 
	BufferList = require('bufferlist').BufferList, 
	baseClient = require('./client');

// Translating LFS insim.h to jspack as follows -
// char	= c
// byte	= B
// word	= H
// short = h
// unsigned	= L
// int = l
// float = f
// char[16] = 16s

/**
 * Supported InSim protocol version
 *
 * @api public
 */
exports.VERSION = 5;

/**
 * Packet ID for IS_NONE (Unknown packet ID)
 *
 * @api public
 */
exports.ISP_NONE = 0;

/**
 * Packet ID for IS_ISI (InSim Init)
 *
 * @api public
 */
exports.ISP_ISI = 1;

/**
 * Packet ID for IS_VER (InSim Version response)
 *
 * @api public
 */
exports.ISP_VER = 2;

/**
 * Packet ID for IS_TINY (Multi-use packet)
 *
 * @api public
 */
exports.ISP_TINY = 3;

/**
 * Packet ID for IS_SMALL (Multi-use packet)
 *
 * @api public
 */
exports.ISP_SMALL = 4;

/**
 * Packet ID for IS_STA (State packet)
 *
 * @api public
 */
exports.ISP_STA = 5;

/**
 * Packet ID for IS_SCH
 *
 * @api public
 */
exports.ISP_SCH = 6;

/**
 * Packet ID for IS_SFP
 *
 * @api public
 */
exports.ISP_SFP = 7;

/**
 * Packet ID for IS_SCC
 *
 * @api public
 */
exports.ISP_SCC = 8;

/**
 * Packet ID for IS_CPP
 *
 * @api public
 */
exports.ISP_CPP = 9;

/**
 * Packet ID for IS_ISM
 *
 * @api public
 */
exports.ISP_ISM = 10;

/**
 * Packet ID for IS_MSO
 *
 * @api public
 */
exports.ISP_MSO = 11;

/**
 * Packet ID for IS_III
 *
 * @api public
 */
exports.ISP_III = 12;

/**
 * Packet ID for IS_MST
 *
 * @api public
 */
exports.ISP_MST = 13;

/**
 * Packet ID for IS_MTC
 *
 * @api public
 */
exports.ISP_MTC = 14;

/**
 * Packet ID for IS_MOD
 *
 * @api public
 */
exports.ISP_MOD = 15;

/**
 * Packet ID for IS_VTN
 *
 * @api public
 */
exports.ISP_VTN = 16;

/**
 * Packet ID for IS_RST
 *
 * @api public
 */
exports.ISP_RST = 17;

/**
 * Packet ID for IS_NCN (New Connection)
 *
 * @api public
 */
exports.ISP_NCN = 18;

/**
 * Packet ID for IS_CNL (Connection Leave)
 *
 * @api public
 */
exports.ISP_CNL = 19;

/**
 * Packet ID for IS_CPR
 *
 * @api public
 */
exports.ISP_CPR = 20;

/**
 * Packet ID for IS_NPL (New Player)
 *
 * @api public
 */
exports.ISP_NPL = 21;

/**
 * Packet ID for IS_PLP
 *
 * @api public
 */
exports.ISP_PLP = 22;

/**
 * Packet ID for IS_PLL
 *
 * @api public
 */
exports.ISP_PLL = 23;

/**
 * Packet ID for IS_LAP
 *
 * @api public
 */
exports.ISP_LAP = 24;

/**
 * Packet ID for IS_SPX
 *
 * @api public
 */
exports.ISP_SPX = 25;

/**
 * Packet ID for IS_PIT
 *
 * @api public
 */
exports.ISP_PIT = 26;

/**
 * Packet ID for IS_PSF
 *
 * @api public
 */
exports.ISP_PSF = 27;

/**
 * Packet ID for IS_PLA
 *
 * @api public
 */
exports.ISP_PLA = 28;

/**
 * Packet ID for IS_CCH
 *
 * @api public
 */
exports.ISP_CCH = 29;

/**
 * Packet ID for IS_PEN
 *
 * @api public
 */
exports.ISP_PEN = 30;

/**
 * Packet ID for IS_TOC
 *
 * @api public
 */
exports.ISP_TOC = 31;

/**
 * Packet ID for IS_FLG
 *
 * @api public
 */
exports.ISP_FLG = 32;

/**
 * Packet ID for IS_PFL
 *
 * @api public
 */
exports.ISP_PFL = 33;

/**
 * Packet ID for IS_FIN (Player finish - Crosses line, may not be final result)
 *
 * @api public
 */
exports.ISP_FIN = 34;

/**
 * Packet ID for IS_RES (Player final result)
 *
 * @api public
 */
exports.ISP_RES = 35;

/**
 * Packet ID for IS_REO
 *
 * @api public
 */
exports.ISP_REO = 36;

/**
 * Packet ID for IS_NLP
 *
 * @api public
 */
exports.ISP_NLP = 37;

/**
 * Packet ID for IS_MCI
 *
 * @api public
 */
exports.ISP_MCI = 38;

/**
 * Packet ID for IS_MSX
 *
 * @api public
 */
exports.ISP_MSX = 39;

/**
 * Packet ID for IS_MSL
 *
 * @api public
 */
exports.ISP_MSL = 40;

/**
 * Packet ID for IS_CRS
 *
 * @api public
 */
exports.ISP_CRS = 41;

/**
 * Packet ID for IS_BFN
 *
 * @api public
 */
exports.ISP_BFN = 42;

/**
 * Packet ID for IS_AXI
 *
 * @api public
 */
exports.ISP_AXI = 43;

/**
 * Packet ID for IS_AXO
 *
 * @api public
 */
exports.ISP_AXO = 44;

/**
 * Packet ID for IS_BTN
 *
 * @api public
 */
exports.ISP_BTN = 45;

/**
 * Packet ID for IS_BTC
 *
 * @api public
 */
exports.ISP_BTC = 46;

/**
 * Packet ID for IS_BTT
 *
 * @api public
 */
exports.ISP_BTT = 47;

/**
 * Packet ID for IS_RIP
 *
 * @api public
 */
exports.ISP_RIP = 48;

/**
 * Packet ID for IS_SSH
 *
 * @api public
 */
exports.ISP_SSH = 49;

/**
 * Packet ID for IS_CON
 *
 * @api public
 */
exports.ISP_CON = 50;

/**
 * Packet ID for IS_OBH
 *
 * @api public
 */
exports.ISP_OBH = 51;

/**
 * Packet ID for IS_HLV (HotLap Verification)
 *
 * @api public
 */
exports.ISP_HLV = 52;

/**
 * Packet ID for IS_PLC
 *
 * @api public
 */
exports.ISP_PLC = 53;

/**
 * Packet ID for IS_AXM
 *
 * @api public
 */
exports.ISP_AXM = 54;

/**
 * Packet ID for IS_ACR
 *
 * @api public
 */
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

/**
 * A cheats way to translate ID to packet object name. The array key for the
 * corresponding packet name MUST match the actual ID of the packet. Because the
 * packets are sequential we dont need to create this with specific keys,
 * however should the packet IDs ever skip a value this will need to be changed.
 *
 * @ignore
 * @api private
 */
exports.ISP_XLATED = [ 'IS_NONE', 'IS_ISI', 'IS_VER', 'IS_TINY', 'IS_SMALL', 'IS_STA', 'IS_SCH',
	'IS_SFP', 'IS_SCC', 'IS_CPP', 'IS_ISM', 'IS_MSO', 'IS_III', 'IS_MST', 'IS_MTC',
	'IS_MOD', 'IS_VTN', 'IS_RST', 'IS_NCN', 'IS_CNL', 'IS_CPR', 'IS_NPL', 'IS_PLP',
	'IS_PLL', 'IS_LAP', 'IS_SPX', 'IS_PIT', 'IS_PSF', 'IS_PLA', 'IS_CCH', 'IS_PEN',
	'IS_TOC', 'IS_FLG', 'IS_PFL', 'IS_FIN', 'IS_RES', 'IS_REO', 'IS_NLP', 'IS_MCI',
	'IS_MSX', 'IS_MSL', 'IS_CRS', 'IS_BFN', 'IS_AXI', 'IS_AXO', 'IS_BTN', 'IS_BTC',
	'IS_BTT', 'IS_RIP', 'IS_SSH', 'IS_CON', 'IS_OBH', 'IS_HLV', 'IS_PLC', 'IS_AXM',
	'IS_ACR' ];

/**
 * Translates a packet ID to the object name.
 *
 * @api private
 */
exports.translatePktIdToName = function(id)
{
	var name = exports.ISP_XLATED[id];

	if ((name == undefined) || (name == null))
		return null;

	return name;
}

/**
 * Insim Packet IS_ISI Flags
 * 
 * @api public 
 */
exports.ISF_RES_0 = 0x01 		// bit 0 : spare
exports.ISF_RES_1 = 0x02 		// bit 1 : spare
exports.ISF_LOCAL = 0x04 		// bit 2 : guest or single player
exports.ISF_MSO_COLS = 0x08 	// bit 3 : keep colours in MSO text
exports.ISF_NLP = 0x10		// bit 4 : receive NLP packets
exports.ISF_MCI = 0x20		// bit 5 : receive MCI packets
exports.ISF_CON = 0x40 		// bit 6 : receive CON packets
exports.ISF_OBH = 0x80 		// bit 7 : receive OBH packets
exports.ISF_HLV = 0x100 		// bit 8 : receive HLV packets
exports.ISF_AXM_LOAD = 0x200 	// bit 9 : receive AXM when loading a layout
exports.ISF_AXM_EDIT = 0x400 // bit 10 : receive AXM when changing objects

exports.IS_ISI = function()
{
	this._PACK = '<BBBBHHBBH16s16s';

	this.size = 44;

	this.type = exports.ISP_ISI;

	this.reqi = 0;
	this.zero = 0;

	this.udpport = 0;
	this.flags = 0;

	this.sp0 = 0;
	this.prefix = ''; 
	this.interval = 0;

	this.admin = '';
	this.iname = '';
}

util.inherits(exports.IS_ISI, baseClient.pkt);

/**
 * Insim Packet IS_TINY
 * 
 * @api public 
 */
exports.IS_TINY = function()
{
	this._PACK = '<BBBB';

	this.size = 4;
	this.type = exports.ISP_TINY;
	this.reqi = 0;
	this.subt = 0;
}

util.inherits(exports.IS_TINY, baseClient.pkt);

/**
 * Insim Packet IS_SMALL
 * 
 * @api public 
 */
exports.IS_SMALL = function()
{
	this._PACK = '<BBBBL';

	this.size = 8;
	this.type = exports.ISP_SMALL;
	this.reqi = 0;
	this.subt = 0;

	this.uval = 0;
}

util.inherits(exports.IS_SMALL, baseClient.pkt);

/**
 * Insim Packet IS_VER
 * 
 * @api public 
 */
exports.IS_VER = function()
{
	this._PACK = '<BBBB8s6sH';

	this.size = 20;
	this.type = exports.ISP_VER;
	this.reqi = 0;
	this.zero = 0;

	this.version = '';
	this.product = '';
	this.insimver = 0;
}

util.inherits(exports.IS_VER, baseClient.pkt);

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

/**
 * Insim Packet IS_STA
 * 
 * @api public 
 */
exports.IS_STA = function()
{
	this._PACK = '<BBBBiHBBBBBBBBBB6sBB';

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

util.inherits(exports.IS_STA, baseClient.pkt);

/**
 * Insim Packet IS_SFP
 * 
 * @api public 
 */
exports.IS_SFP = function()
{
	this._PACK = '<BBBBHBB';

	this.size = 8;
	this.type = exports.ISP_SFP;
	this.reqi = 0;
	this.zero = 0;

	this.flag = 0;
	this.offon = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_SFP, baseClient.pkt);

/**
 * Insim Packet IS_MOD
 * 
 * @api public 
 */
exports.IS_MOD = function()
{
	this._PACK = '<BBBBllll';

	this.size = 20;
	this.type = exports.ISP_MOD;
	this.reqi = 0;
	this.zero = 0;

	this.bits16 = 0;
	this.rr = 0;
	this.width = 0;
	this.height = 0;
}

util.inherits(exports.IS_MOD, baseClient.pkt);

/**
 * Insim Packet IS_MSO
 * 
 * @api public 
 */

exports.MSO_SYSTEM = 0; // system message
exports.MSO_USER = 1; // normal visible user message
exports.MSO_PREFIX = 2; // hidden message starting with special prefix (see ISI)
exports.MSO_O = 3; // hidden message typed on local pc with /o command

exports.IS_MSO = function()
{
	this._PACK = '<BBBBBBBB128s';

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

util.inherits(exports.IS_MSO, baseClient.pkt);

/**
 * Insim Packet IS_III
 * 
 * @api public 
 */
exports.IS_III = function()
{
	this._PACK = '<BBBBBBBB64s';

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

util.inherits(exports.IS_III, baseClient.pkt);

/**
 * Insim Packet IS_ACR
 * 
 * @api public 
 */
exports.IS_ACR = function()
{
	this._PACK = '<BBBBBBBB64s';

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

util.inherits(exports.IS_ACR, baseClient.pkt);

/**
 * Insim Packet IS_MST
 * 
 * @api public 
 */
exports.IS_MST = function()
{
	this._PACK = '<BBBB64s';

	this.size = 60;
	this.type = exports.ISP_MST;
	this.reqi = 0;
	this.zero = 0;

	this.msg = '';
}

util.inherits(exports.IS_MST, baseClient.pkt);

/**
 * Insim Packet IS_MSX
 * 
 * @api public 
 */
exports.IS_MSX = function()
{
	this._PACK = '<BBBB96s';

	this.size = 100;
	this.type = exports.ISP_MSX;
	this.reqi = 0;
	this.zero = 0;

	this.msg = '';
}

util.inherits(exports.IS_MSX, baseClient.pkt);

// Message Sounds (for Sound byte)
exports.SND_SILENT = 0;
exports.SND_MESSAGE = 1;
exports.SND_SYSMESSAGE = 2;
exports.SND_INVALIDKEY = 3;
exports.SND_ERROR = 4;
exports.SND_NUM = 5;

/**
 * Insim Packet IS_MSL
 * 
 * @api public 
 */
exports.IS_MSL = function()
{
	this._PACK = '<BBBB128s';

	this.size = 132;
	this.type = exports.ISP_MSL;
	this.reqi = 0;
	this.sound = 0;

	this.msg = '';
}

util.inherits(exports.IS_MSL, baseClient.pkt);

/**
 * Insim Packet IS_MTC
 * 
 * @api public 
 */
exports.IS_MTC = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_MTC;
	this.reqi = 0;
	this.sound = 0;

	this.ucid = 0;
	this.plid = 0;
	this.sp2 = 0;
	this.sp3 = 0;

	this.text = '';
}

util.inherits(exports.IS_MTC, baseClient.pkt);

exports.IS_MTC.prototype.pack = function(values)
{
	var len = this.text.length;

	if (len > 127)
		len = 127;

	this._PACK += len+1 + 's';

	this.text += 0;

	this.size += len;

	var properties = this.getProperties();
	var values = [];
	for (var i = 0; i < properties.length; i++)
		values.push(this[properties[i]]);

	return jspack.Pack(this._PACK, values);
}

/**
 * Insim Packet IS_SCH
 * 
 * @api public 
 */
exports.IS_SCH = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_SCH;
	this.reqi = 0;
	this.zero = 0;

	this.charb = 0;
	this.flags = 0;
	this.spare2 = 0;
	this.spare3 = 0;

}

util.inherits(exports.IS_SCH, baseClient.pkt);

/**
 * Insim Packet IS_ISM
 * 
 * @api public 
 */
exports.IS_ISM = function()
{
	this._PACK = '<BBBBBBBB32s';

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

util.inherits(exports.IS_ISM, baseClient.pkt);

// The Vote Actions
exports.VOTE_NONE = 0 // no vote
exports.VOTE_END = 1; // end race
exports.VOTE_RESTART = 2 ; // restart
exports.VOTE_QUALIFY = 3; // qualify
exports.VOTE_NUM = 4;

/**
 * Insim Packet IS_VTN
 * 
 * @api public 
 */
exports.IS_VTN = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_VTN;
	this.reqi = 0;
	this.zero = 0;

	this.ucid = 0;
	this.action = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_VTN, baseClient.pkt);

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

/**
 * Insim Packet IS_PLC
 * 
 * @api public 
 */
exports.IS_PLC = function()
{
	this._PACK = '<BBBBBBBBL';

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

util.inherits(exports.IS_PLC, baseClient.pkt);

/**
 * Insim Packet IS_RST
 * 
 * @api public 
 */
exports.IS_RST = function()
{
	this._PACK = '<BBBBBBBB6sBBHHHHHH';

	this.size = 28;
	this.type = exports.ISP_RST;
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
}

util.inherits(exports.IS_RST, baseClient.pkt);

/**
 * Insim Packet IS_NCN
 * 
 * @api public 
 */
exports.IS_NCN = function()
{
	this._PACK = '<BBBB24s24sBBBB';

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

util.inherits(exports.IS_NCN, baseClient.pkt);

/**
 * Insim Packet IS_CNL
 * 
 * @api public 
 */
exports.IS_CNL = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_CNL;
	this.reqi = 0;
	this.ucid = 0;

	this.reason = 0;
	this.total = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_CNL, baseClient.pkt);

/**
 * Insim Packet IS_CPR
 * 
 * @api public 
 */
exports.IS_CPR = function()
{
	this._PACK = '<BBBB24s8s';

	this.size = 36;
	this.type = exports.ISP_CPR;
	this.reqi = 0;
	this.ucid = 0;

	this.pname = '';
	this.plate = '';
}

util.inherits(exports.IS_CPR, baseClient.pkt);

/**
 * Insim Packet IS_NPL
 * 
 * @api public 
 */
exports.IS_NPL = function()
{
	this._PACK = '<BBBBBBH24s8s4s16s4ABBBBlBBBB';

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

util.inherits(exports.IS_NPL, baseClient.pkt);

/**
 * Insim Packet IS_PLP
 * 
 * @api public 
 */
exports.IS_PLP = function()
{
	this._PACK = '<BBBB';

	this.size = 4;
	this.type = exports.ISP_PLP;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_PLP, baseClient.pkt);

/**
 * Insim Packet IS_PLL
 * 
 * @api public 
 */
exports.IS_PLL = function()
{
	this._PACK = '<BBBB';

	this.size = 4;
	this.type = exports.ISP_PLL;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_PLL, baseClient.pkt);

/**
 * Insim Packet IS_CRS
 * 
 * @api public 
 */
exports.IS_CRS = function()
{
	this._PACK = '<BBBB';

	this.size = 4;
	this.type = exports.ISP_CRS;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_CRS, baseClient.pkt);

/**
 * Insim Packet IS_LAP
 * 
 * @api public 
 */
exports.IS_LAP = function()
{
	this._PACK = '<BBBBLLHHBBBB';

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

util.inherits(exports.IS_LAP, baseClient.pkt);

/**
 * Insim Packet IS_SPX
 * 
 * @api public 
 */
exports.IS_SPX = function()
{
	this._PACK = '<BBBBLLBBBB';

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

util.inherits(exports.IS_SPX, baseClient.pkt);

/**
 * Insim Packet IS_PIT
 * 
 * @api public 
 */
exports.IS_PIT = function()
{
	this._PACK = '<BBBBHHBBBB4ALL';

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

util.inherits(exports.IS_PIT, baseClient.pkt);

/**
 * Insim Packet IS_PSF
 * 
 * @api public 
 */
exports.IS_PSF = function()
{
	this._PACK = '<BBBBLL';

	this.size = 12;
	this.type = exports.ISP_PSF;
	this.reqi = 0;
	this.plid = 0;

	this.stime = 0;
	this.spare = 0;
}

util.inherits(exports.IS_PSF, baseClient.pkt);

exports.PITLANE_EXIT = 0; // 0 - left pit lane
exports.PITLANE_ENTER = 1; // 1 - entered pit lane
exports.PITLANE_NO_PURPOSE = 2; // 2 - entered for no purpose
exports.PITLANE_DT = 3; // 3 - entered for drive-through
exports.PITLANE_SG = 4; // 4 - entered for stop-go

/**
 * Insim Packet IS_PLA
 * 
 * @api public 
 */
exports.IS_PLA = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_PLA;
	this.reqi = 0;
	this.plid = 0;

	this.fact = 0;
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_PLA, baseClient.pkt);

/**
 * Insim Packet IS_CCH
 * 
 * @api public 
 */
exports.IS_CCH = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_CCH;
	this.reqi = 0;
	this.plid = 0;

	this.camera = '';
	this.sp1 = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_CCH, baseClient.pkt);

/**
 * Insim Packet IS_PEN
 * 
 * @api public 
 */
exports.IS_PEN = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_PEN;
	this.reqi = 0;
	this.plid = 0;

	this.oldpen = '';
	this.newpen = 0;
	this.reason = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_PEN, baseClient.pkt);

/**
 * Insim Packet IS_TOC
 * 
 * @api public 
 */
exports.IS_TOC = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_TOC;
	this.reqi = 0;
	this.plid = 0;

	this.olducid = 0;
	this.newucid = 0;
	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_TOC, baseClient.pkt);

exports.FLG_BLUE = 1; // given
exports.FLG_YELLOW = 1; // receiving

/**
 * Insim Packet IS_FLG
 * 
 * @api public 
 */
exports.IS_FLG = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_FLG;
	this.reqi = 0;
	this.plid = 0;

	this.offon = 0;
	this.flag = 0;
	this.carbehind = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_FLG, baseClient.pkt);

/**
 * Insim Packet IS_PFL
 * 
 * @api public 
 */
exports.IS_PFL = function()
{
	this._PACK = '<BBBBHH';

	this.size = 8;
	this.type = exports.ISP_PFL;
	this.reqi = 0;
	this.plid = 0;

	this.flags = 0;
	this.spare = 0;
}

util.inherits(exports.IS_PFL, baseClient.pkt);

/**
 * Insim Packet IS_FIN
 * 
 * @api public 
 */
exports.IS_FIN = function()
{
	this._PACK = '<BBBBLLBBBBHH';

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

util.inherits(exports.IS_FIN, baseClient.pkt);

/**
 * Insim Packet IS_RES
 * 
 * @api public 
 */
exports.IS_RES = function()
{
	this._PACK = '<BBBB24s24s8s4sLLBBBBHHBBH';

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

util.inherits(exports.IS_RES, baseClient.pkt);

/**
 * Insim Packet IS_REO
 * 
 * @api public 
 */
exports.IS_REO = function()
{
	this._PACK = '<BBBB32A';

	this.size = 36;
	this.type = exports.ISP_REO;
	this.reqi = 0;
	this.nump = 0;

	this.plid = '';
}

util.inherits(exports.IS_REO, baseClient.pkt);

/**
 * Insim Packet IS_AXI
 * 
 * @api public 
 */
exports.IS_AXI = function()
{
	this._PACK = '<BBBBBBH32s';

	this.size = 40;
	this.type = exports.ISP_AXI;
	this.reqi = 0;
	this.zero = 0;

	this.axstart = 0;
	this.numcp = 0;
	this.numo = 0;

	this.lname = '';
}

util.inherits(exports.IS_AXI, baseClient.pkt);

/**
 * Insim Packet IS_AXO
 * 
 * @api public 
 */
exports.IS_AXO = function()
{
	this._PACK = '<BBBB';

	this.size = 4;
	this.type = exports.ISP_AXO;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_AXO, baseClient.pkt);

/**
 * Insim Packet IS_AXO
 * 
 * @api public 
 */
exports.IS_AXO = function()
{
	this._PACK = '<BBBB';

	this.size = 4;
	this.type = exports.ISP_AXO;
	this.reqi = 0;
	this.plid = 0;
}

util.inherits(exports.IS_AXO, baseClient.pkt);

// NodeLap
exports.IS_NODELAP = function()
{
	this._PACK = '<HHBB';

	this.node = 0;
	this.lap = 0;
	this.plid = 0;
	this.position = 0;
}

util.inherits(exports.IS_NODELAP, baseClient.pkt);

/**
 * Insim Packet IS_NLP
 * 
 * @api public 
 */
exports.IS_NLP = function()
{
	this.size = 0;
	this.type = exports.ISP_NLP;
	this.reqi = 0;
	this.nump = 0;

	this.info = [];
}

util.inherits(exports.IS_NLP, baseClient.pkt);

exports.IS_NLP.prototype.unpack = function(buf)
{
	var self = this;

	// Base properties
	var data = jspack.Unpack(self._PACK, buf, 0);

	var properties = this.getProperties();
	for (var i = 0; i < properties.length; i++)
	{
		if (properties[i] == "info")
			continue;

		self[properties[i]] = data[i];
	}

	// NodeLap unpacking
	for(var i = 0; i < self.numc; i++)
	{
		// Next packet start position
		var start = 4 + (i * 6);
		var tbuf = buf.slice(start, (start + 28));

		var c = new exports.IS_NODELAP;
		c.unpack(tbuf);

		self.info.push(c);
	}
}

// CompCar

// CompCar info flags
exports.CCI_BLUE = 1;
exports.CCI_YELLOW = 2;
exports.CCI_LAG = 32;
exports.CCI_FIRST = 64;
exports.CCI_LAST = 128;

exports.IS_COMPCAR = function()
{
	this._PACK = '<HHBBBBlllHHHh';

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
}

util.inherits(exports.IS_COMPCAR, baseClient.pkt);

/**
 * Insim Packet IS_MCI
 * 
 * @api public 
 */
exports.IS_MCI = function()
{
	this._PACK = '<BBBB';

	// Variable size packet
	// 4 + (numc * 28)
	this.size = 0;
	this.type = exports.ISP_MCI;
	this.reqi = 0;
	this.numc = 0;

	this.compcar = [];
}

util.inherits(exports.IS_MCI, baseClient.pkt);

exports.IS_MCI.prototype.pack = function(values)
{
	throw new Error('Unsupported at this time');
}

exports.IS_MCI.prototype.unpack = function(buf)
{
	var self = this;

	// Base properties
	var data = jspack.Unpack(self._PACK, buf, 0);

	var properties = this.getProperties();
	for (var i = 0; i < properties.length; i++)
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

		var c = new exports.IS_COMPCAR;
		c.unpack(tbuf);

		self.compcar.push(c);
	}
}

/**
 * Insim Packet IS_CARCONTACT
 * 
 * @api public 
 */
exports.IS_CARCONTACT = function()
{
	this._PACK = '<BBBcBBBBBBcchh';

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
}

util.inherits(exports.IS_CARCONTACT, baseClient.pkt);

/**
 * Insim Packet IS_CON
 * 
 * @api public 
 */
exports.IS_CON = function()
{
	this._PACK = '<BBBB';

	this.size = 40;
	this.type = exports.ISP_CON;
	this.reqi = 0;
	this.numc = 0;

	this.spclose = 0;
	this.time = 0;

	this.a = null;
	this.b = null;
}

util.inherits(exports.IS_CON, baseClient.pkt);

exports.IS_CON.prototype.unpack = function(buf)
{
	var self = this;

	// Base properties
	var data = jspack.Unpack(self._PACK, buf, 0);
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

exports.IS_CARCONTOBJ = function()
{
	this._PACK = '<BBBBhh';

	this.direction = 0;
	this.heading = 0;
	this.speed = 0;
	this.sp3 = 0;

	this.x = 0;
	this.y = 0;
}

util.inherits(exports.IS_CARCONTOBJ, baseClient.pkt);

// IS_OBH OBHFlags
exports.OBH_LAYOUT = 1;
exports.OBH_CAN_MOVE = 2;
exports.OBH_WAS_MOVING = 4;
exports.OBH_ON_SPOT = 8;

/**
 * Insim Packet IS_OBH
 * 
 * @api public 
 */
exports.IS_OBH = function()
{
	// TODO - FINISH
	this._PACK = '<BBBBHH';

	this.size = 24;
	this.type = exports.ISP_OBH;
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
}

util.inherits(exports.IS_OBH, baseClient.pkt);

/**
 * Insim Packet IS_HLV
 * 
 * @api public 
 */
exports.IS_HLV = function()
{
	this._PACK = '<BBBBBBH';

	this.size = 16;
	this.type = exports.ISP_HLV;
	this.reqi = 0;
	this.plid = 0;

	this.hlvc = 0;
	this.sp1 = 0;
	this.time = 0;

	this.c = null;
}

util.inherits(exports.IS_HLV, baseClient.pkt);

exports.HLVC_GROUND = 0;
exports.HLVC_WALL = 1;
exports.HLVC_SPEED = 2;

exports.IS_HLV.prototype.unpack = function(buf)
{
	var self = this;

	// Base properties
	var data = jspack.Unpack(self._PACK, buf, 0);
	var properties = this.getProperties();
	var start = 8;

	for (var i = 0; i < properties.length; i++)
	{
		if (properties[i] == "c")
		{
			var tbuf = buf.slice(start, (start + 8));
			var c = new exports.IS_CARCONTOBJ;
			c.unpack(tbuf);
			self[properties[i]] = c;

			start += 16;
			continue;
		}

		self[properties[i]] = data[i];
	}
}

// ObjectInfo
exports.IS_OBJECTINFO = function()
{
	this._PACK = '<hhcBBB';

	this.x = 0;
	this.y = 0;
	this.zchar = 0;
	this.flags = 0;
	this.index = 0;
	this.heading = 0;
}

util.inherits(exports.IS_OBJECTINFO, baseClient.pkt);

// IS_AXM pmoaction flags
exports.PMO_LOADING_FILE = 0;
exports.PMO_ADD_OBJECTS = 1;
exports.PMO_DEL_OBJECTS = 2;
exports.PMO_CLEAR_ALL = 3;
exports.PMO_NUM = 4;

/**
 * Insim Packet IS_AXM
 * 
 * @api public 
 */
exports.IS_AXM = function()
{
	this._PACK = '<hhcBBB';

	this.size = 0;
	this.type = exports.ISP_AXM;
	this.reqi = 0;
	this.numo = 0;

	this.ucid = 0;
	this.pmoaction = 0;
	this.pmoflags = 0;
	this.sp3 = 0;

	this.info = [];
}

util.inherits(exports.IS_AXM, baseClient.pkt);

exports.IS_AXM.prototype.unpack = function(buf)
{
	var self = this;

	// Base properties
	var data = jspack.Unpack(self._PACK, buf, 0);
	var properties = this.getProperties();
	var start = 8;

	for (var i = 0; i < properties.length; i++)
	{
		if (properties[i] == "info")
			continue;

		self[properties[i]] = data[i];
	}

	// ObjectInfo unpacking
	for(var i = 0; i < self.numo; i++)
	{
		// Next packet start position
		var start = 8 + (i * 8);
		var tbuf = buf.slice(start, (start + 28));

		var c = new exports.IS_OBJECTINFO;
		c.unpack(tbuf);

		self.info.push(c);
	}
}

exports.VIEW_FOLLOW = 0; // arcade
exports.VIEW_HELI = 1; //helicopter
exports.VIEW_CAM = 2; // tv camera
exports.VIEW_DRIVER = 3; // cockpit
exports.VIEW_CUSTOM = 4; // - custom

/**
 * Insim Packet IS_SCC
 * 
 * @api public 
 */
exports.IS_SCC = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_SCC;
	this.reqi = 0;
	this.zero = 0;

	// set ingamecam or viewplid to 255 to leave that option unchanged
	this.viewplid = 255;
	this.ingamecam = 255;

	this.sp2 = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_SCC, baseClient.pkt);

/**
 * Insim Packet IS_CPP
 * 
 * @api public 
 */
exports.IS_CPP = function()
{
	this._PACK = '<BBBB3lHHHBBfHH';

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

	// valid state flags that can be set -
	// ISS_SHIFTU - shiftu mode
	// ISS_SHIFTU_FOLLOW - shiftu follow view
	// ISS_VIEW_OVERRIDE - override user view
	this.flags = 0;
}

util.inherits(exports.IS_CPP, baseClient.pkt);

/**
 * Insim Packet IS_RIP
 * 
 * @api public 
 */
exports.IS_RIP = function()
{
	this._PACK = '<BBBBBBBBLL64s';

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

util.inherits(exports.IS_RIP, baseClient.pkt);

/**
 * Insim Packet IS_SSH
 * 
 * @api public 
 */
exports.IS_SSH = function()
{
	this._PACK = '<BBBBBBBB32s';

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

util.inherits(exports.IS_SSH, baseClient.pkt);

// IS_BFN subt
exports.BFN_DEL_BTN = 0;
exports.BFN_CLEAR = 1;
exports.BFN_USER_CLEAR = 2;
exports.BFN_REQUEST = 3;

/**
 * Insim Packet IS_BFN
 * 
 * @api public 
 */
exports.IS_BFN = function()
{
	this._PACK = '<BBBBBBBB';

	this.size = 8;
	this.type = exports.ISP_BFN;
	this.reqi = 0;
	this.subt = 0;

	this.ucid = 0;
	this.clickid = 0;
	this.inst = 0;
	this.sp3 = 0;
}

util.inherits(exports.IS_BFN, baseClient.pkt);

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

/**
 * Insim Packet IS_BTN
 * 
 * @api public 
 */
exports.IS_BTN = function()
{
	this._PACK = '<BBBBBBBBBBBB';

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

util.inherits(exports.IS_BTN, baseClient.pkt);

exports.IS_BTN.prototype.pack = function(values)
{
	var len = this.text.length;

	if (len > 240)
		len = 240;

	this._PACK += len + 's';

	this.size += len;

	var properties = this.getProperties();
	var values = [];
	for (var i = 0; i < properties.length; i++)
		values.push(this[properties[i]]);

	return jspack.Pack(this._PACK, values);
}

/**
 * Insim Packet IS_BTC click types
 * 
 * @api public 
 */
exports.ISB_LMB = 1; // left mouse button click
exports.ISB_RMB = 2; // right mount button click
exports.ISB_CTRL = 3; // ctrl + left button click
exports.ISB_SHIFT = 4; // shift + left button click

/**
 * Insim Packet IS_BTC
 * 
 * @api public 
 */
exports.IS_BTC = function()
{
	this._PACK = '<BBBBBBBB';

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

util.inherits(exports.IS_BTC, baseClient.pkt);

exports.IS_BTC.prototype.isLeftClick = function()
{
	return (this.cflags == exports.ISB_LMB);
}

exports.IS_BTC.prototype.isRightClick = function()
{
	return (this.cflags == exports.ISB_RMB);
}

/**
 * Insim Packet IS_BTT
 * 
 * @api public 
 */
exports.IS_BTT = function()
{
	this._PACK = '<BBBBBBBB96s';

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

util.inherits(exports.IS_BTT, baseClient.pkt);

/**
 * Client object that represents an OutGauge connection.
 *
 * @api public
 * @extends Client
 * @param {Object} options Options object
 * @param {Object} [log] Logger instance
 */
var Client = function(options, log)
{
	var self = this;

	baseClient.client.call(this, options, log);

	self.buffer = new BufferList;
	self.stream = null;

	// should be set by plugins automagically
	// when the plugin init function is called
	self.isiFlags = 0;
	self.udpPort = 0;

	self.isHost = '';
	self.hostname = '';

	// 'this' context that plugin functions are call
	self.ctx.insim = exports;
	self.ctx.outgauge = require('./outgauge');
	self.ctx.outsim = require('./outsim');

	self.registerHook('IS_VER', self.onIS_VER);
};

util.inherits(Client, baseClient.client);

/**
 * Connects to LFS, and registers a handful of callbacks to deal with
 * disconnections, etc.
 *
 * @api public
 */
Client.prototype.connect = function()
{
	var self = this;

	self.emit('preconnect');

	self.stream = net.createConnection(self.options.port, self.options.host);

	// connect
	self.stream.on('connect', function(socket)
	{
		var p = new exports.IS_ISI;
		p.iname = self.name;
		p.flags = self.isiFlags;
		p.interval = 1000;
		p.udpport = self.udpPort;
		p.reqi = 1; // request the InSim version from host

		if ((self.options.admin != undefined) && (self.options.admin.length > 0))
			p.admin = self.options.admin;

		if ((self.options.prefix != undefined) && (self.options.prefix.length == 1))
			p.prefix = self.options.prefix;

		if ((self.options.udpport != undefined) && (self.options.udpport > 0))
			p.udpport = self.options.udpport;

		self.send(p);
	});

	// data
	self.stream.on('data', function(data)
	{
		self.receive.call(self, data);
	});

	self.stream.on('close', function(err)
	{
		self.log.info('Disconnected ');

		if ((self.options.reconnect > 0) && (self.reconnectAttempts <= self.options.reconnect))
		{
			// reconnection logic
			var cooldown = (self.reconnectAttempts * self.options.reconnectcooldown);

			self.log.info('Lost connection, attempting reconnect (' + self.reconnectAttempts + ') in ' + cooldown + ' seconds');

			setTimeout(function() { self.connect.call(self); }, (cooldown * 1000));
			return;
		}

		// disconnect only gets emitted after all reconnection attempts have
		// been made
		// really disconnect should be thought of as a terminating event
		self.emit('disconnect');

		if (err)
			self.log.info('Server disappeared');
	});

	// error handling
	self.stream.on('error', function(err)
	{
		self.log.crit(err);
	});

	self.stream.on('timeout', function()
	{
		self.log.crit('Timeout occured');
	});
}

/**
 * Closes the socket that is listening for data.
 *
 * @api public
 */
Client.prototype.disconnect = function()
{
	var self = this;

	var p = new exports.IS_TINY;
	p.subt = exports.TINY_CLOSE;
	self.send(p);

	self.stream.end();
}

/**
 * Sends a packet to LFS
 *
 * @api public
 * @param {Object} pkt
 */
Client.prototype.send = function(pkt)
{
	var self = this;

	var b = new Buffer(pkt.pack());
	self.stream.write(b);

	b = null;
	pkt = null; // should be the last point we care about the packet. but do we want to assume this?
}

/**
 * Receives and parses data from LFS, into distinct packets. Once parsed into
 * complete packets it emits events containing that packet information.
 *
 * @api private
 */
Client.prototype.receive = function(data)
{
	var self = this;

	this.buffer.push(data);

	var pos = 0;
	var size = self.peekByte();

	while ((self.buffer.length > 0) && (size <= self.buffer.length))
	{
		var p = self.buffer.take(size);
		self.buffer.advance(size);

		self.log.verbose('Buffer size ' + self.buffer.length);

		var pktId = p.readUInt8(1);
		var pktName = exports.translatePktIdToName(pktId);
		self.log.verbose('Packet ' + pktName + ' consumed @ size ' + size);

		try
		{
			var pkt = new exports[pktName];
			pkt.unpack(p);

			self.log.verbose('Emitting event \'' + pktName + '\'');
			self.emit(pktName, pkt);
		}
		catch (err)
		{
			if (pktName == 'undefined')
				self.log.crit('Packet Id unknown - ' + pktId);
			self.log.crit('Error');
			self.log.crit(err.stack);
			self.log.crit(util.inspect(err));
		}

		// next packet size
		size = self.peekByte();
	}

	if (self.buffer.length > self.maxbacklog)
		throw new Error('Buffer is greater than the maximum permitted backlog. Dying.');
}

/**
 * Peeks (returns without removing from the buffer) the byte at a given offset
 *
 * @api private
 * @param {Number} offset
 */
Client.prototype.peekByte = function(offset)
{
	var self = this;

	offset = offset || 0;

	if (offset >= self.buffer.length)
		return 0;

	return self.buffer.take(1).readUInt8(offset);
}

/**
 * Bound to the event IS_VER, designed to check and handle if the InSim version
 * is not the one expected.
 *
 * @api private
 * @param {Object} pkt
 */
Client.prototype.onIS_VER = function(pkt)
{
	if (pkt.insimver != this.insim.VERSION)
		this.log.crit("Reported InSim Version from LFS does not match our library supported version. May result in undesirable behaviour!");

	this.client.emit('connect');
}

/**
 * Exports the InSim client object
 *
 * @api public
 * @return {Object}
 */
exports.client = Client;

}(typeof exports === "undefined"
        ? (this.insim = {})
        : exports));

