
# exports.IRP_ARQ

 * @api public

 Packet ID for IRP_ARQ

# exports.IRP_ARP

 * @api public

 Packet ID for IRP_ARP

# exports.IRP_HLR

 * @api public

 Packet ID for IRP_HLR

# exports.IRP_HOS

 * @api public

 Packet ID for IRP_HOS

# exports.IRP_SEL

 * @api public

 Packet ID for IRP_SEL

# exports.IRP_ERR

 * @api public

 Packet ID for IRP_ERR

# exports.IR_HLR()

 * @api public

 Insim Relay Packet IR_HLR (Host List Request)

# exports.IR_HOSTINFO()

 * @api private

 Insim Relay Sub-packet containing HostInfo, used in IR_HOS

# exports.IR_HOS()

 * @api public

 Insim Relay Packet IR_HOS (Online hosts, connected to LFSW Relay)

# exports.IR_SEL()

 * @api public

 Insim Relay Packet IR_SEL (Select host)

# exports.IR_ARQ()

 * @api public

 Insim Relay Packet IR_ArQ (Admin Request)

# exports.IR_ERR_PACKET

 * @api public

 IR_ERR errno - Invalid packet

# exports.IR_ERR_PACKET2

 * @api public

 IR_ERR errno - Invalid packet

# exports.IR_ERR_HOSTNAME

 * @api public

 IR_ERR errno - Invalid hostname

# exports.IR_ERR_ADMIN

 * @api public

 IR_ERR errno - Invalid admin password

# exports.IR_ERR_SPEC

 * @api public

 IR_ERR errno - Invalid spectator password

# exports.IR_ERR_NOSPEC

 * @api public

 IR_ERR errno - Invalid spectator password - none provided

# exports.IR_ERR()

 * @api public

 Insim Relay Packet IR_ERR

# Client()

 * @api public
 * @param {Object} options Options object
 * @param {Object} [log] Logger instance

 Client object that represents an OutGauge connection.

# Client.prototype.connect()

 * @api public

 Starts a listening socket that waits for OutGauge messages.

# Client.prototype.disconnect()

 * @api public

 Closes the socket that is listening for data.

# Client.prototype.send()

 * @api public
 * @param {Object} pkt 

 Sends a packet to LFS

# exports.client

 * @api public

 Exports the OutSim client object
