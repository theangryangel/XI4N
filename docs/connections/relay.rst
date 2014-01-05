LFS World Relay
===============

The LFS World Relay is operated by the LFS developers, and allows one or more
InSim applications to connect to a LFS dedicated host, without having to
directly open InSim to the world.

Talk
----
``relay``

Options
-------

====== ========================================= ========== =========== =========
Option Description                               Values     Defaults to Suggested
====== ========================================= ========== =========== =========
host   Hostname you want to connect to           Any        
admin  Admin password LFS has configured         Any                    
spec   Spectator password LFS has configured     Any                    
====== ========================================= ========== =========== =========

Example
-------

* Talks relay

* Connecting to "test host #1"

* Admin password of "pies"

* Using plugins with aliases
   * your-plugin-name
   * your-plugin-name-2

* Logging errors only to the console

.. code-block:: yaml

    - talk: relay
      relay:
        host: test host #1
        admin: pies
      use:
        - your-plugin-name
        - your-plugin-name-2
      log:
        - level: error
          type: console

    
