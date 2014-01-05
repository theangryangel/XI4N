Plugins
=======

Plugins extend xi4n's core functionality, which is effectively to do nothing
except maintain a connection to your chosen InSim, OutSim, Outgauge or LFS World
Relay server.

Luckily xi4n both ships with some pre-made plugins and also has the capability
for new plugins to be written and packaged up.

Using Plugins
-------------

To use one of the plugins included with xi4n (see the rest of this page for a
list), just add an extra option in the `plugins` section of your `config.yaml`
file, like so.

.. code-block:: yaml

    plugins: 
        - alias: your-name-for-plugin
          path: plugin-name
          options: 

To add a second plugin you'd do something like this:

.. code-block:: yaml

    plugins: 
        - alias: your-name-for-plugin
          path: plugin-name
          options: 
        - alias: your-name-for-plugin-2
          path: plugin-name-2
          options: 

To active a plugin for a connection, you add the plugin's alias to the list of
plugins against the connection. For example, to add both `your-plugin-name` and
`your-plugin-name-2` to an InSim connection, talking to localhost, via TCP on
port 29999, and outputs errors to the console, you should have a configuration
that looks something like this:

.. code-block:: yaml

    - talk: insim
      insim:
        over: tcp
        host: localhost
        port: 29999
      use:
        - your-plugin-name
        - your-plugin-name-2
      log:
        - level: error
          type: console


Why all this alias bollocks? The main benefit is that you can have the same
plugin running with 2 different sets of options, or you can have the same plugin
running on multiple servers. 

Core Plugins
------------

There are a bunch of plugins that are shipped as part of xi4n and should be
maintained as things progress. These plugins will not appear in your
configuration directories, but should be available.

Each plugin will have it's own set of options. You should look carefully at the
appropriate page to make sure that you configure each correctly. 


* :doc:`busy`: An anti-idler plugin.
* :doc:`gauges`: An outgauge plugin that draws a beatiful gauge on a webpage,
  representing whats happening on the car you're driving (in real time).
* :doc:`livemap2`: A live tracker map, that displays on a web page, the live
  positions of racers (in real time).
* :doc:`veto`: An anti-vote plugin
* :doc:`powered-by-text`: A small example plugin, that shows how to display text when someone connects to a server.
* :doc:`powered-by-buttons`: A small example plugin, that shows how to display a button that auto-hides when someone connects to a server.
* :doc:`state`: A "meta" plugin that maintains a definition of the current state of LFS including players, connections and server state (weather, track, etc.) - many plugins will probably depend on this, typically you will most likely be asked to add the plugin, but do nothing else with it.
* :doc:`slmbr`: A joke InSim application, that rewards players for not moving.
* :doc:`tv`: A Work In Progress automatic TV director.

Other Plugins
-------------

In addition to the plugins that come with xi4n, you can also use plugins that
are maintained by third parties. To use a third party plugin:

* Download the source for the plugin and place it into
  `your-configuration-directory/plugins/plugin-name` where `plugin-name` is the
  name of the plugin.

* Read the plugin documentation. It may require you to edit `package.json` and
  then run ``npm install`` in the configuration directory.

* Edit `config.yaml` and enable the plugin as above.

* Restart xi4n.


Writing Plugins
---------------

See :doc:`/dev/plugins`.
