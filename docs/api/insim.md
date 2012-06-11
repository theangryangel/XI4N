
# exports.VERSION

 * @api public

 Supported InSim protocol version

# exports.ISP_NONE

 * @api public

 Packet ID for IS_NONE (Unknown packet ID)

# exports.ISP_ISI

 * @api public

 Packet ID for IS_ISI (InSim Init)

# exports.ISP_VER

 * @api public

 Packet ID for IS_VER (InSim Version response)

# exports.ISP_TINY

 * @api public

 Packet ID for IS_TINY (Multi-use packet)

# exports.ISP_SMALL

 * @api public

 Packet ID for IS_SMALL (Multi-use packet)

# exports.ISP_STA

 * @api public

 Packet ID for IS_STA (State packet)

# exports.ISP_SCH

 * @api public

 Packet ID for IS_SCH

# exports.ISP_SFP

 * @api public

 Packet ID for IS_SFP

# exports.ISP_SCC

 * @api public

 Packet ID for IS_SCC

# exports.ISP_CPP

 * @api public

 Packet ID for IS_CPP

# exports.ISP_ISM

 * @api public

 Packet ID for IS_ISM

# exports.ISP_MSO

 * @api public

 Packet ID for IS_MSO

# exports.ISP_III

 * @api public

 Packet ID for IS_III

# exports.ISP_MST

 * @api public

 Packet ID for IS_MST

# exports.ISP_MTC

 * @api public

 Packet ID for IS_MTC

# exports.ISP_MOD

 * @api public

 Packet ID for IS_MOD

# exports.ISP_VTN

 * @api public

 Packet ID for IS_VTN

# exports.ISP_RST

 * @api public

 Packet ID for IS_RST

# exports.ISP_NCN

 * @api public

 Packet ID for IS_NCN (New Connection)

# exports.ISP_CNL

 * @api public

 Packet ID for IS_CNL (Connection Leave)

# exports.ISP_CPR

 * @api public

 Packet ID for IS_CPR

# exports.ISP_NPL

 * @api public

 Packet ID for IS_NPL (New Player)

# exports.ISP_PLP

 * @api public

 Packet ID for IS_PLP

# exports.ISP_PLL

 * @api public

 Packet ID for IS_PLL

# exports.ISP_LAP

 * @api public

 Packet ID for IS_LAP

# exports.ISP_SPX

 * @api public

 Packet ID for IS_SPX

# exports.ISP_PIT

 * @api public

 Packet ID for IS_PIT

# exports.ISP_PSF

 * @api public

 Packet ID for IS_PSF

# exports.ISP_PLA

 * @api public

 Packet ID for IS_PLA

# exports.ISP_CCH

 * @api public

 Packet ID for IS_CCH

# exports.ISP_PEN

 * @api public

 Packet ID for IS_PEN

# exports.ISP_TOC

 * @api public

 Packet ID for IS_TOC

# exports.ISP_FLG

 * @api public

 Packet ID for IS_FLG

# exports.ISP_PFL

 * @api public

 Packet ID for IS_PFL

# exports.ISP_FIN

 * @api public

 Packet ID for IS_FIN (Player finish - Crosses line, may not be final result)

# exports.ISP_RES

 * @api public

 Packet ID for IS_RES (Player final result)

# exports.ISP_REO

 * @api public

 Packet ID for IS_REO

# exports.ISP_NLP

 * @api public

 Packet ID for IS_NLP

# exports.ISP_MCI

 * @api public

 Packet ID for IS_MCI

# exports.ISP_MSX

 * @api public

 Packet ID for IS_MSX

# exports.ISP_MSL

 * @api public

 Packet ID for IS_MSL

# exports.ISP_CRS

 * @api public

 Packet ID for IS_CRS

# exports.ISP_BFN

 * @api public

 Packet ID for IS_BFN

# exports.ISP_AXI

 * @api public

 Packet ID for IS_AXI

# exports.ISP_AXO

 * @api public

 Packet ID for IS_AXO

# exports.ISP_BTN

 * @api public

 Packet ID for IS_BTN

# exports.ISP_BTC

 * @api public

 Packet ID for IS_BTC

# exports.ISP_BTT

 * @api public

 Packet ID for IS_BTT

# exports.ISP_RIP

 * @api public

 Packet ID for IS_RIP

# exports.ISP_SSH

 * @api public

 Packet ID for IS_SSH

# exports.ISP_CON

 * @api public

 Packet ID for IS_CON

# exports.ISP_OBH

 * @api public

 Packet ID for IS_OBH

# exports.ISP_HLV

 * @api public

 Packet ID for IS_HLV (HotLap Verification)

# exports.ISP_PLC

 * @api public

 Packet ID for IS_PLC

# exports.ISP_AXM

 * @api public

 Packet ID for IS_AXM

# exports.ISP_ACR

 * @api public

 Packet ID for IS_ACR

# exports.ISP_XLATED

 * @api private

 A cheats way to translate ID to packet object name. The array key for the
 corresponding packet name MUST match the actual ID of the packet. Because the
 packets are sequential we dont need to create this with specific keys,
 however should the packet IDs ever skip a value this will need to be changed.

# exports.translatePktIdToName()

 * @api private

 Translates a packet ID to the object name.

# exports.ISF_RES_0

 * @api public

 Insim Packet IS_ISI Flags

# exports.IS_TINY()

 * @api public

 Insim Packet IS_TINY

# exports.IS_SMALL()

 * @api public

 Insim Packet IS_SMALL

# exports.IS_VER()

 * @api public

 Insim Packet IS_VER

# exports.IS_STA()

 * @api public

 Insim Packet IS_STA

# exports.IS_SFP()

 * @api public

 Insim Packet IS_SFP

# exports.IS_MOD()

 * @api public

 Insim Packet IS_MOD

# exports.MSO_SYSTEM

 * @api public

 Insim Packet IS_MSO

# exports.IS_III()

 * @api public

 Insim Packet IS_III

# exports.IS_ACR()

 * @api public

 Insim Packet IS_ACR

# exports.IS_MST()

 * @api public

 Insim Packet IS_MST

# exports.IS_MSX()

 * @api public

 Insim Packet IS_MSX

# exports.IS_MSL()

 * @api public

 Insim Packet IS_MSL

# exports.IS_MTC()

 * @api public

 Insim Packet IS_MTC

# exports.IS_SCH()

 * @api public

 Insim Packet IS_SCH

# exports.IS_ISM()

 * @api public

 Insim Packet IS_ISM

# exports.IS_VTN()

 * @api public

 Insim Packet IS_VTN

# exports.IS_PLC()

 * @api public

 Insim Packet IS_PLC

# exports.IS_RST()

 * @api public

 Insim Packet IS_RST

# exports.IS_NCN()

 * @api public

 Insim Packet IS_NCN

# exports.IS_CNL()

 * @api public

 Insim Packet IS_CNL

# exports.IS_CPR()

 * @api public

 Insim Packet IS_CPR

# exports.IS_NPL()

 * @api public

 Insim Packet IS_NPL

# exports.IS_PLP()

 * @api public

 Insim Packet IS_PLP

# exports.IS_PLL()

 * @api public

 Insim Packet IS_PLL

# exports.IS_CRS()

 * @api public

 Insim Packet IS_CRS

# exports.IS_LAP()

 * @api public

 Insim Packet IS_LAP

# exports.IS_SPX()

 * @api public

 Insim Packet IS_SPX

# exports.IS_PIT()

 * @api public

 Insim Packet IS_PIT

# exports.IS_PSF()

 * @api public

 Insim Packet IS_PSF

# exports.IS_PLA()

 * @api public

 Insim Packet IS_PLA

# exports.IS_CCH()

 * @api public

 Insim Packet IS_CCH

# exports.IS_PEN()

 * @api public

 Insim Packet IS_PEN

# exports.IS_TOC()

 * @api public

 Insim Packet IS_TOC

# exports.IS_FLG()

 * @api public

 Insim Packet IS_FLG

# exports.IS_PFL()

 * @api public

 Insim Packet IS_PFL

# exports.IS_FIN()

 * @api public

 Insim Packet IS_FIN

# exports.IS_RES()

 * @api public

 Insim Packet IS_RES

# exports.IS_REO()

 * @api public

 Insim Packet IS_REO

# exports.IS_AXI()

 * @api public

 Insim Packet IS_AXI

# exports.IS_AXO()

 * @api public

 Insim Packet IS_AXO

# exports.IS_AXO()

 * @api public

 Insim Packet IS_AXO

# exports.IS_NLP()

 * @api public

 Insim Packet IS_NLP

# exports.IS_MCI()

 * @api public

 Insim Packet IS_MCI

# exports.IS_CARCONTACT()

 * @api public

 Insim Packet IS_CARCONTACT

# exports.IS_CON()

 * @api public

 Insim Packet IS_CON

# exports.IS_OBH()

 * @api public

 Insim Packet IS_OBH

# exports.IS_HLV()

 * @api public

 Insim Packet IS_HLV

# exports.IS_AXM()

 * @api public

 Insim Packet IS_AXM

# exports.IS_SCC()

 * @api public

 Insim Packet IS_SCC

# exports.IS_CPP()

 * @api public

 Insim Packet IS_CPP

# exports.IS_RIP()

 * @api public

 Insim Packet IS_RIP

# exports.IS_SSH()

 * @api public

 Insim Packet IS_SSH

# exports.IS_BFN()

 * @api public

 Insim Packet IS_BFN

# exports.IS_BTN()

 * @api public

 Insim Packet IS_BTN

# exports.ISB_LMB

 * @api public

 Insim Packet IS_BTC click types

# exports.IS_BTC()

 * @api public

 Insim Packet IS_BTC

# exports.IS_BTT()

 * @api public

 Insim Packet IS_BTT

# Client()

 * @api public
 * @param {Object} options Options object
 * @param {Object} [log] Logger instance

 Client object that represents an OutGauge connection.

# Client.prototype.connect()

 * @api public

 Connects to LFS, and registers a handful of callbacks to deal with
 disconnections, etc.

# Client.prototype.disconnect()

 * @api public

 Closes the socket that is listening for data.

# Client.prototype.send()

 * @api public
 * @param {Object} pkt 

 Sends a packet to LFS

# Client.prototype.receive()

 * @api private

 Receives and parses data from LFS, into distinct packets. Once parsed into
 complete packets it emits events containing that packet information.

# Client.prototype.peekByte()

 * @api private
 * @param {Number} offset 

 Peeks (returns without removing from the buffer) the byte at a given offset

# Client.prototype.onIS_VER()

 * @api private
 * @param {Object} pkt 

 Bound to the event IS_VER, designed to check and handle if the InSim version
 is not the one expected.

# exports.client

 * @api public

 Exports the InSim client object
