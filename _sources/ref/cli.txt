Command Line Interface
======================

.. only:: man

    SYNOPSIS
    --------

    | **xi4n** *command* [*args*...]
    | **xi4n help** *command*

.. only:: html

    **xi4n** is the command-line interface to xi4n.

    You invoke xi4n by specifying a *command*, like so::

        xi4n COMMAND [ARGS...]

    The rest of this document describes the available commands. If you ever need
    a quick list of what's available, just type ``xi4n help``.

Commands
--------

init
^^^^
::

    xi4n init DIR [options]

Creates a basic xi4n configuration directory, including:

1. Basic ``config.yaml``.

2. ``plugins`` directory where all your custom plugins will reside for that
   particular configuration.

3. ``package.json`` which describes the dependencies necessary for your plugins.

4. ``README.html`` which is basically useless.


start
^^^^^

::

    xi4n start DIR [options]

Starts a xi4n configuration.

boilerplate
^^^^^^^^^^^

::

    xi4n boilerplate [options] DIR

Creates a boilerplate plugin in DIR.

docs
^^^^

::

    xi4n docs


Hosts documentation in a live web server, useful for offline viewing.
Unavailable when using development versions of xi4n.


config
^^^^^^

::
    
    xi4n config [options] DIR

Starts a web-based configuration tool editor. Currently EXPERIMENTAL and
INCOMPLETE.
