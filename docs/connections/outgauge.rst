OutGauge
======

Talk
----
``outgauge``

Options
-------

====== ========================================= ========== =========== =========
Option Description                               Values     Defaults to Suggested
====== ========================================= ========== =========== =========
host   Host address to bind to                   IP         0.0.0.0     0.0.0.0        
port   Port number to listen for outsim packets  0-65535    12345                  
====== ========================================= ========== =========== =========

Example
-------

* Talks outgauge

* Listens on port 29997

* Using plugins with aliases
   * your-plugin-name
   * your-plugin-name-2

* Logging errors only to the console

.. code-block:: yaml

    - talk: outgauge
      outgauge:
        port: 29997
      use:
        - your-plugin-name
        - your-plugin-name-2
      log:
        - level: error
          type: console

    
