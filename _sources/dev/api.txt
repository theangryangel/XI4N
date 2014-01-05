API
===

This page describes the internal API of xi4n at it's core. It's a work in
progress since xi4n is a platform first and a library second, its API is
mainly undocumented, but is reasonably stable.

If you're planning on using xi4n as a library, honestly I highly recommend
reading the source of xi4n code. xi4n itself is using the same modules that
you can require(), thus it's always going to be the most up to date repository
of information.

Require
-------

1. Specify xi4n as a dependency in your `package.json`.

2. Run ``npm install`` as you would normally to pull down the new dependency.
   
3. In your code `var xi4n = require('xi4n');`.

4. Hack. Hack. Hack.


Exported modules
----------------

protocol.insim
^^^^^^^^^^^^^^
Creates an instance of an insim client.

protocol.outsim
^^^^^^^^^^^^^^^
Creates an instance of an outsim client.

protocol.outgauge
^^^^^^^^^^^^^^^^^
Creates an instance of an outgauge client.

protocol.relay
^^^^^^^^^^^^^^
Creates an instance of a LFSW relay client.

strings
^^^^^^^

product
^^^^^^^

data
^^^^
