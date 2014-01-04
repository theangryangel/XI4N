Getting Started
===============

Installing
----------

To begin you'll need the following:


* A working LFS dedicated server, or LFS client installation with Insim
  configured on a known and available port

* A working nodejs and npm installation - you can get this from nodejs.org, or
  if you're on an Operating System blessed with a package manager, most likely
  from a common repository

* A text editor of your choice

Once you've met the prerequisties it's pretty simple:

1. If you don't have it, install Nodejs (seriously, that was in the prequisties)

2. Open a command prompt and install xi4n by running ``npm install xi4n -g``

3. You're all set and ready to rock! Type ``xi4n help`` at the command prompt
   and it should come back with a list of commands you can run.

Configuring
-----------

xi4n with a configuration directory, unlike other programs. In this directory is
a collection of files, some of which will be configuration files and others
which can be plugins to change how xi4n behaves. 

The idea is that each directory is self contained and allows you to separate out
your configurations easily.

However, don't think that this means that it's 1 configuration directory per
InSim, OutSim, Outgauge or LFS World Relay connection. xi4n supports multiple
connections at the same time, to multiple different servers, regardless of type.
This means you can have 1 configuration file that connects to multiple LFS
installations and share or pass data between them.

1. To create a configuration directory open a command prompt and type ``xi4n init
   test``.

2. This will have created a directory called ``test``. Open that directory and
   you should see at minimum:
   * A file called ``config.yaml`` which contains the default configuration
   * A directory called ``plugins`` which by default will be empty. Your custom
     plugins will go in here.

By default ``config.yaml`` will connect to a LFS instance running InSim on port
29999, on localhost with no admin password. It will load the state plugin which
is a default plugin that whilst not required makes life easier for other
plugins, and is frequently used.

Editing the default configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The configuration file is written in YAML (rhymes with camel), which is a human-readable
data serialization format. Easier to edit than other file formats, but can be a
bit touchy on getting the spacing right.

Running
-------

Running a configuration is dead easy. Once you've edited your ``config.yaml``
and added any plugins you want to setup, simply:

1. Open a command prompt and switch into the directory that holds your
   configuration directory.

2. Assuming your configuration directory is called ``test`` run the command
   ``xi4n start test``. If you're already in the directory you can also run
   ``xi4n start .`` instead.

3. Make sure you do not close the command prompt window. Doing so will stop
   xi4n. It is possible to "daemonize" or turn xi4n into a service using other
   tools or scripting, however we'll leave that up to you. 
   * On Windows we'd recommend nssm.
   * On Linux it really depends on your init system. Sysvinit scripts or systemd
     unit files are reasonably easy to write, but are only 2 of several options.

Stopping
--------

1. Switch to the command prompt running xi4n.

2. Press control and c on your keyboard.

3. Wait a few seconds and xi4n will stop.

Errors
------

xi4n tries to be fairly plain speaking when an error occurs, however you can
configure xi4n to send errors to a log file only, or to the screen. 

Make sure you check any log files and also the output on the command prompt.

Updating
--------

We try not to break stuff, but sometimes it has to happen for progress. 

Prior to 0.1.0 xi4n was architecturally very different. If you're running an
older version I highly recommend creating a new configuration and porting across
your settings manually. Unfortunately there is currently not automatic mechanism.

Upgrading after 0.1.0 should be a lot easier as we don't intend to make any more
silly mistakes.

1. Open a command prompt.

2. Type ``npm upgrade xi4n -g``.

3. Stop and restart any running xi4n instances.
