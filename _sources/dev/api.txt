API
===

This page describes the public API of xi4n at it's core. It's a work in
progress since xi4n is a platform first and a library second, its API is
mainly undocumented, but is reasonably stable.

If you're planning on using xi4n as a library, honestly I highly recommend
reading the source of xi4n code. xi4n itself is using the same modules that
you can require(), thus it's always going to be the most up to date repository
of information.

Basic usage
-----------

1. Specify xi4n as a dependency in your `package.json`.

2. Run ``npm install`` as you would normally to pull down the new dependency.
   
3. In your code `var xi4n = require('xi4n');`.

4. Hack. Hack. Hack.

xi4n.protocols.manager
----------------------

Manages a collection of clients; insim, outsim, outgauge or relay.

.. js:class:: xi4n.protocols.manager(options)

    Manages one or more clients. 
    Clients are automatically created and setup from options object.

    :param object options: An object of options

.. js:function:: xi4n.protocols.manager.start()

    Attempts to start/connect all associated clients.

.. js:function:: xi4n.protocols.manager.stop()

    Attempts to stop/disconnect all associated clients.


xi4n.protocols.insim
--------------------

.. js:class:: xi4n.protocols.insim(options[, log])

    An insim client. Implements the insim protocol, and also understands and
    decodes outsim and outgauge, when setup to be sent over insim.

    Emit events, named the same as the insim, outsim, or outgauge packet name.

    :param object options: An object of options
    :param object log: Optional logger. An instance of winston, or compatible logger is required. If none provided all log entries go into a black hole.

.. js:function:: xi4n.protocols.insim.connect()

    Attempts to establish a connection.

.. js:function:: xi4n.protocols.insim.disconnect()

    Disconnects any active connections.

.. js:function:: xi4n.protocols.insim.send(data)

    Sends data down any active insim connection.

    :param object data: An instance of an object. Must implement pack() function that returns a binary string of an insim packet.

.. js:function:: xi4n.protocols.insim.on(event, callback)

    :param string event: Event you're listening for. Typically an insim packet
    name. 
    :param function callback: Function that is called when the event is
    received.

    Adds a callback to run, when event is emitted.

.. js:function:: xi4n.protocols.insim.off(event, callback)

    Removes a callback from the event queue.

    :param string event: Event you want to remove the callback from.
    :param function callback: Callback you want to remove.

xi4n.protocols.outsim
---------------------

.. js:class:: xi4n.protocols.outsim(options[, log])

    An outsim client. Implements the outsim protocol.

    Emit events, named the same as the outsim packet.

    :param object options: An object of options
    :param object log: Optional logger. An instance of winston, or compatible logger is required. If none provided all log entries go into a black hole.

.. js:function:: xi4n.protocols.outsim.connect()

    Creates a listening UDP socket.
    
.. js:function:: xi4n.protocols.outsim.disconnect()

    Kills the listening socket.

.. js:function:: xi4n.protocols.outsim.on(event, callback)

    Adds a callback to run, when event is emitted.

    :param string event: Event you're listening for. Typically an outsim packet name. 
    :param function callback: Function that is called when the event is received.

.. js:function:: xi4n.protocols.outsim.off(event, callback)

    Removes a callback from the event queue.

    :param string event: Event you want to remove the callback from.
    :param function callback: Callback you want to remove.

xi4n.protocols.outgauge
-----------------------

.. js:class:: xi4n.protocols.outsim(options[, log])

    An outsim client. Implements the outgauge protocol.

    Emit events, named the same as the outgauge packet.

    :param object options: An object of options
    :param object log: Optional logger. An instance of winston, or compatible logger is required. If none provided all log entries go into a black hole. 

.. js:function:: xi4n.protocols.outsim.connect()

    Creates a listening UDP socket.
    
.. js:function:: xi4n.protocols.outsim.disconnect()

    Kills the listening socket.

.. js:function:: xi4n.protocols.outgauge.on(event, callback)

    Adds a callback to run, when event is emitted.

    :param string event: Event you're listening for. Typically an outgauge packet name. 
    :param function callback: Function that is called when the event is received.

.. js:function:: xi4n.protocols.outgauge.off(event, callback)

    Removes a callback from the event queue.

    :param string event: Event you want to remove the callback from.
    :param function callback: Callback you want to remove.

xi4n.protocols.relay
--------------------

.. js:class:: xi4n.protocols.relay(options[, log])

    LFS World relay client. Implements the both relay and insim protocols.

    Emit events, named the same as the insim or relay packet.

    :param object options: An object of options
    :param object log: Optional logger. An instance of winston, or compatible logger is required. If none provided all log entries go into a black hole.

.. js:function:: xi4n.protocols.relay.connect()

    Creates a connection to the LFS World relay.

.. js:function:: xi4n.protocols.relay.select(host[, admin_password[, spectator_password]])

    Convenience function that sends a IR_SEL packet to the LFS World relay and
    selects a host to receive data from.

    :param string host: Host you want to select to receive insim data from.
    :param string admin_password: Optional administrator password for host.
    :param string spectator_password: Optional spectator password for host.

.. js:function:: xi4n.protocols.relay.disconnect()

    Disconnects from the LFS World relay.

.. js:function:: xi4n.protocols.relay.send(data)

    :param object data: An instance of an object. Must implement pack() function that returns a binary string of a relay packet.

.. js:function:: xi4n.protocols.relay.on(event, callback)

    Adds a callback to run, when event is emitted.

    :param string event: Event you're listening for. Typically an insim or relay packet name. 
    :param function callback: Function that is called when the event is received.

.. js:function:: xi4n.protocols.relay.off(event, callback)

    Removes a callback from the event queue.

    :param string event: Event you want to remove the callback from.
    :param function callback: Callback you want to remove.

xi4n.product
------------

.. js:attribute:: xi4n.product.basedir

    The base directory of the xi4n install.

.. js:attribute:: xi4n.product.name

    The name of the product (read from package.json)

.. js:attribute:: xi4n.product.bversion

    The version of the product (read from package.json).
    Semver compatible.

.. js:attribute:: xi4n.product.bfull

    Full product string - product name and version number.


xi4n.strings
------------

Provides a bunch of useful functions to deal with LFS' codepages and special
codes - such as colours.

.. js:function:: xi4n.strings.toUTF8(string)

    Converts a LFS string to a UTF-8 string. Colour codes are not removed.

    :param string string: Input string from LFS.


.. js:function:: xi4n.strings.translateSpecials(string)

    Convers special characters into their UTF-8 equivilent, such as ^^ into ^.

    :param string string: Input string from LFS.


.. js:function:: xi4n.strings.remColours(string)

    Removes colour codes from a LFS string, replacing them with nothing.

    :param string string: Input string from LFS.


xi4n.data.pth
-------------

.. js:function:: xi4n.data.pth.get(track)

    Returns a pth file, converted into json for convenience.

    :param string track: Short track name i.e. BL1.


xi4n.data.vehicle
-----------------

.. js:attribute:: xi4n.data.vehicle.all

    Contains an array of vehicles, and their relevant facts.

    Example return format::

        [
        	{ short: 'XFG', long: 'XF GTI', layout: 'Hatchback', drive: 'FWD', kw: 86, bhp: 115, kg: 942, lb: 2076, demo: true, s1: true, s2: true },
            ...
            { short: 'FZR', long: 'FZ50 GTR', layout: 'Race', drive: 'RWD', kw: 465, bhp: 490, kg: 110, lb: 2425, demo: false, s1: false, s2: true }
        ]

.. js:function:: xi4n.data.vehicle.findBy(callback)

    Returns an array of vehicles, and their relevant facts, filtered by
    callback.

    :param function callback: Callback used to filter vehicles.


.. js:function:: xi4n.data.vehicle.countBy(callback)

    Counts the number of vehicles that match the filtering callback.

    :param function callback: Callback used to filter vehicles.


.. js:function:: xi4n.data.vehicle.randomOneBy([callback])

    Returns a single vehicle, optionally filtered by a callback.

    :param function callback: Optional Callback used to filter vehicles.


xi4n.data.track
---------------

.. js:attribute:: xi4n.data.track.all

    Contains an array of track, and their relevant facts.

    Example return format::

        [
            { short: 'BL1', long: 'Blackwood GP', km: 3.307, mi: 2.055, grid: 32, s1: true, s2: true, demo: true, reversible: true },        
            ...
            { short: 'AS7', long: 'Aston North', km: 5.168, mi: 3.211, grid: 32, s1: false, s2: true, demo: false, reversible: true }
        ]

.. js:function:: xi4n.data.track.findBy(callback)

    Returns an array of tracks, and their relevant facts, filtered by
    callback.

    :param function callback: Callback used to filter tracks.


.. js:function:: xi4n.data.track.countBy(callback)

    Counts the number of vehicles that match the filtering callback.

    :param function callback: Callback used to filter vehicles.


.. js:function:: xi4n.data.track.randomOneBy([callback])

    Returns a single track, optionally filtered by a callback.

    :param function callback: Optional Callback used to filter tracks.

