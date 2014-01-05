Insim
=====

Supporting pure Insim connections over both TCP and UDP. It also supports outsim
and outgauge packets when setup via insim (can be done by one or more plugins).

Talk
----
``insim``

Options
-------

====== ========================================= ========== =========== =========
Option Description                               Values     Defaults to Suggested
====== ========================================= ========== =========== =========
over   How to talk to LFS                        TCP or UDP TCP         TCP
port   Port # LFS is configured to talk insim on 0-65535    29999       Any avail
admin  Admin password LFS has configured         Any                    
====== ========================================= ========== =========== =========

Example
-------

* Talks insim

* Over tcp

* To localhost on port 29999

* Using plugins with aliases
   * your-plugin-name
   * your-plugin-name-2

* Logging errors only to the console

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

    
