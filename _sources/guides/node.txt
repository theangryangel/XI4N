Installing Node.js
=================

You'll need `Node.js`_ in order to run xi4n. It should work on any future
version, however there is no guarantee. It has been tested on 0.6.x-0.10.x.

.. _Node.js: http://www.nodejs.org/

* **Windows** download and run the installer from `Node.js`_.

* **Mac OS X** You can either download a package from `Node.js`_.
  If you prefer Homebrew install via ``brew install node``.
  If you prefer MacPorts install via ``port install nodejs``.

* **Debian, Linux Mint Debian Edition**, Node.js is packaged in Debian Sid/Unstable. You can either use
  `Apt Pinning`_ or manually download the deb packages (`node` and `npm` to install it.
  If you're already running Sid/Unstable Run ``apt-get install nodejs npm`` with
  root privileges to install it.

.. ATTENTION::
   Debian has a naming conflict with Amateur Packet Radio Node Program.
   Accordingly the normal ``node`` command is infact ``nodejs``.

* **Ubuntu, Mint, elementary OS**, depending on the version Node.js is likely to already
  be available in the main repository, although most likely an old version. Run
  ``sudo apt-get install nodejs`` to install it.
  To install a more modern version there is a useful third party repository
  which you can use. ``sudo apt-get update
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs``

.. ATTENTION::
   Ubuntu and it's derivates have a naming conflict with Amateur Packet Radio Node Program.
   Accordingly the normal ``node`` command is infact ``nodejs``.

* **openSUSE, SLE** have packaged Node.js already. Run ``sudo zypper in nodejs nodejs-devel``

* **Fedora** ``sudo yum install npm``

* **RHEL/CentOS/Scientific Linux 6**, Node.js and npm are available from the
  Fedora Extra Packages for Enterprise Linux (EPEL) repository. If you haven't
  already done so, first enable EPEL. Then run ``sudo yum install npm``

* **Arch Linux**, Node.js is available in the Community Repository. ``pacman -S
  nodejs``

* **Gentoo**, Node.js is available via portage. ``emerge nodejs``

* **FreeBSD, OpenBSD**, Node.js is available via ports. 

* **Building from source**, depends on your platform. Please consult the Node.js
  documentation. I'll assume you know what you're doing.

.. _Apt Pinning: https://wiki.debian.org/AptPreferences#Pinning
