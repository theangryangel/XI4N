
# exports.OG_PACK()

 * @api public

 Object that represents OutGauge packet.

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

 * @param {Object} pkt Packet instance

 No-op for OutSim.

# Client.prototype.receive()

 * @api public
 * @param {Buffer} data 

 Receives data from the socket and parses the data, if it's successfully
 parsed it emit the event to the relevant subscribers

# exports.client

 * @api public

 Exports the OutSim client object
