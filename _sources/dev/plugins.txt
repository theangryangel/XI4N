Writing Plugins
===============

You know Javascript, right?

Seriously, you do need to know Javascript and it's idiosyncrasies. Particularly
how scoping & 'this' works. xi4n takes advantage of it.

Lets start at the basics
------------------------

What exactly is Insim/Outsim/Outgauge/LFSW Relay?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These are all protocols used to talk to Live For Speed (LFS) servers and clients. The
general gist is that when something happens in LFS a packet is sent from the
server or client you're connected to and your application receives that packet
of information and does something with it.

In the instance of Insim and the LFSW Relay, you can also send data back to LFS.

Make sense?

How does xi4n fit into all of this?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

What xi4n does is take away the heavy lifting of parsing data from LFS and
maintaining the connection, as well as giving you the ability to connect to
multiple different types of connections.

However, xi4n does not do much additional translation. It merely takes the data
from LFS, and turns it into an event that is in turn passed to plugins.

So how do I do X?
^^^^^^^^^^^^^^^^^

Since all xi4n does is translate the packets into an event (which is a
javascript object) you need to write a plugin that listens for the relevant
event and then reacts to it.

How do I know what events to listen for?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

xi4n emits events that match the LFS packet name. You can find all of these and
description of what they do in your LFS installation, in docs/Insim.txt or on
the LFS wiki.

So, taking a practical example, you want to know when one player hits another
player. Looking in Insim.txt you'll see that IS_CON is the packet for a contact
between players, so you listen for the event IS_CON. Simple, no?


Can other plugins emit events?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Yes. Infact one of the plugins bundled with xi4n does exactly this - it's a
:doc:`/plugins/state` plugin that tracks the vital information and presents it in a more usable
format.

How do you know what to listen for when depending on another plugin?
Unfortunately you'll either have to read the documentation or read the code. If
it's a core plugin the relevant plugin page will have a list of events.


Writing Your first plugin
-------------------------

1. Open a command propt and switch into your configuration directory.

2. Run ``xi4n boilerplate plugins/your-awesome-plugin-name``. This generates a  directory with the same name as the plugin and a basic package.json, and plugin file.

3. Open `plugins/your-awesome-plugin-name/lib.js` with your favourite text
   editor. You'll see there's already the barebones of a plugin already.

4. In the file you'll see an object being created called plugin, which has:
   * A `constructor` function that takes the argument `options`.
   * An `associate` function that takes the argument `client`.
   * Finally a `module.exports = plugin;` line. This line exports the plugin
     class so that it can be used by xi4n.

5. If you have any setup to do on a per instance basis you should do it in the
   constructor.

6. The `associate` function is called when a plugin is associated with a
   connection to LFS. The connection is the `client` argument in the
   boilerplate. It's in this `associate` function that you setup any listeners
   you want for packets from each LFS connection. Bear in mind that since a
   plugin can be associated with **multiple** connections of multiple types, you
   may need to think carefully how you store your data.
