Connections
===========

Without a connection xi4n does absolutely nothing.

A connection is defined as a source and/or destination for data to and from a
LFS or the LFS World Relay. In practical terms this is often a dedicated server,
client or the relay itself.

Each configuration can have multiple connections and multiple plugins.

For information on plugins see the :doc:`/plugins/index` page. 

Types of connection
-------------------

There are several types of connection that xi4n currently supports:

* :doc:`insim`: Supporting pure InSim connections over both TCP and UDP. It also
  supports outsim and outgauge packets when setup via insim.

* :doc:`outsim`: Supporting pure OutSim connections over UDP.

* :doc:`outgauge`: Supporting pure OutGauge connections over UDP.

* :doc:`relay`: InSim connections, via the LFS World Relay, when direct InSim is
  not permitted.

Configuring a connection
------------------------

To create a connection just add an extra value in the `connections` section of your `config.yaml`
file. For example the section below shows a single connection, talking insim,
extracted from part of a working `config.yaml`.

.. HINT::
    See :doc:`/ref/config` for a full commented reference.

.. code-block:: yaml

    connections:
        # The first connection begins here. 
        # Note that it's talking "insim"
        - talk: insim
          # Next are the insim options
          insim:
            # Each connection type has different options.
            # Here we tell it we want to use tcp
            over: tcp
            # The host is 'localhost'
            host: localhost
            # And the port is 29999.
            port: 29999
            # With an admin password of 'pies'
            admin: pies
          # Next we tell the connection that we want to use the plugins with the
          # aliases of 'state' and 'livemap'
          use:
            - state
            - livemap
          # Next, we tell xi4n how to log stuff.
          # In this instance we have 2 logging options setup.
          log:
            # The first is to only output errors to the console.
            - level: error
              type: console
            # The second is that we log informational errors to a file called
            # info.log
            - level: info
              type: file
              filename: info.log

How do you know what options to set? See the relevant page for the type of
connection, in the list in the previous section.
