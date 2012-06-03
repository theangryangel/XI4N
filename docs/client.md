
# Client()

 * @api public
 * @param {Object} options Configuration
 * @param {Object} [log] Logger instance, if not provided it's generated for you

 Abstract Client - All other instances derive from this, such as InSim,
 Outgauge and Outsim. Along this class is not useful.

# Client.prototype.setOptions()

 * @api public
 * @param {Object} [options] Configuration

 Sets the associated client options. If not provided some base settings are
 created and set.

# Client.prototype.emit()

 * @api public
 * @param {Object} [options] Configuration

 emit
 
 Emits an event to the event subscribers.
 
 Overwrite the standard eventemitter.emit with our own
 this is the easiest way I can see of how to call with our own scope context
 and still permit us to easily remove a listener at a later date (closures
 causes issues with this, naturally :-/)
 this is basically almost a straight copy of the original emit

# Client.prototype.connect()

 * @api public

 Connects to LFS using the given protocol. This MUST be provided by the
 relevant subclass.

# Client.prototype.disconnect()

 * @api public

 Disconnects from LFS. This MUST be provided by the relevant subclass.

# Client.prototype.send()

 * @api public

 Sends a packet to LFS. This MUST be provided by the relevant subclass.

# Client.prototype.receive()

 * @api public

 Receives and parses packets from LFS. This MUST be provided by the relevant subclass.

# Client.prototype.registerHook()

 * @api public

 A useful, but deprecated, alias for .on

# Client.prototype.unregisterHook()

 * @api public

 A complementing, but deprecated, function for .registerHook

# Client.prototype.off()

 * @param {String} pktName Packet to remove function from
 * @param {Function} func Function to remove
 * @api public

 A better alias for .removeListener.

# Client.prototype.initPlugin()

 * @api public
 * @param {Object} plugin Plugin instance
 * @param {String} name Plugin name

 Attachs a plugin instance to this client instance.

# exports.client

 * @api public

 Exports the client
