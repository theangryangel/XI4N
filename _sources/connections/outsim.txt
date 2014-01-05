Outsim
======

.. WARNING::
    Outsim support has not been extensively tested.
    Please be aware of this BEFORE you hook up to any motion simulators/other
    devices.

Talk
----
``outsim``

Options
-------

====== ========================================= ========== =========== =========
Option Description                               Values     Defaults to Suggested
====== ========================================= ========== =========== =========
host   Host address to bind to                   IP         0.0.0.0     0.0.0.0        
port   Port number to listen for outsim packets  0-65535                    
====== ========================================= ========== =========== =========

Example
-------

* Talks outsim

* Listens on port 29997

* Using plugins with aliases
   * your-plugin-name
   * your-plugin-name-2

* Logging errors only to the console

.. code-block:: yaml

    - talk: outsim
      outsim:
        port: 29997
      use:
        - your-plugin-name
        - your-plugin-name-2
      log:
        - level: error
          type: console

    
