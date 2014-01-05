config.yaml
===========

Below you'll find a commented example configuration file.

It describes each step of the way and what's happening.

.. HINT::
    We have a work in-progress web interface that allows you to drag and drop
    options into place without having to manually edit `config.yaml`. It's not
    yet complete, so if you want to help us out with that, dive into the code
    and take a look!

    You can give it a go by running ``xi4n config path/to/config/directory`` and
    following the instructions.

.. HINT::
    You do not need to worry about extra options. Any options that xi4n does not
    recognise it will ignore.


.. ATTENTION::
    Pay close attention to the spacing. YAML is touchy about getting things
    right.
    
.. code-block:: yaml

    # Here we describe what versions of xi4n this configuration should support.
    # We may drop this in future.
    # We describe here that we only care about versions greater than or equal to
    # 0.1.0
    xi4n: ">=0.1.0"
    # Next is a list of plugins and their options.
    plugins: 
        # Our first plugin is an instance of the state plugin.
        # We've given it an alias of 'state'. 
        # An alias allows a plugin to used on multiple different connections.
        - alias: state
          # Here we set the 'path' of the plugin. xi4n will look for plugins in
          # 2 places, the system or core plugin directory and the configuration
          # plugin directory.
          # The value MUST correspond to the actual name of the directory.
          # For system or core plugins this is the same as the name in the
          # documentation list
          path: state
          # Finally options. This is a list of options for the plugin.
          options: 
        # Below you'll find a setup for a second plugin, called livemap2. We've
        # given it an alias of livemap, for demonstration reasons.
        - alias: livemap
          path: livemap2
          options:
            http-port: 8080
    # Next up is a list of connections.
    # xi4n can make multiple connections, to multiple different servers, all
    # talking different protocols.
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
            # By default xi4n uses debug, info, warn and error levels only.
            # debug is debugging information
            # info is informational but less spammy than debug
            # warn is for non-serious errors
            # error is for errors that may not be recoverable
            - level: error
              # Here we set the type to console.
              # xi4n uses 'winston' under the hood, so can support any winston
              # transport.
              # The 2 you'll most likely use are 'console' to output to the
              # screen and 'file' to output to a file.
              type: console
            # The second is that we log informational errors to a file called
            # info.log
            - level: info
              type: file
              filename: info.log
        # Here's a second insim connection
        # Note, in this instance we use the same plugins, but don't have any
        # admin password set, and it's talking on port 29998 instead.
        - talk: insim
          insim:
            over: tcp
            host: localhost
            port: 29998
          use:
            - state
            - livemap
          log:
            - level: error
              type: console


