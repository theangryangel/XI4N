# Installing Prerequisities
  - Install Nodejs for your platform
    * For Windows or Mac OSX download from nodejs.org
    * For Linux consult your distributions package manager for "node"

# Installing (stable)
  - Start a command line interface
  - Run `npm install xi4n -g` to download and install the latest release of xi4n

# Installing xi4n from git (development)
The development version of xi4n is not guaranteed to be stable. It *should* be,
however mistakes happen. 
  - Download https://github.com/theangryangel/XI4N/zipball/master
  - Extract it somewhere temporarily
  - Start a command line interface and change into that temporary directory
  - Run `npm install . -g` to install xi4n

# Setting up and running xi4n
  - Now we need to create a configuration and plugin directory. Run `xi4n -i
    path/to/create/config`
  - Now head into the path you specified above, and open and edit config.json to
    meet your needs
  - Once you've made your changes all you need to do is start an instance of LFS
    and enable insim.
     * For a server the easiest thing to do is to edit your server's .cfg file
       and set the /insim port and /admin password. Ensure that the line are not
       commented out. 29999 is the default InSim port. You MUST set the admin
       password as well.
     * For a client you can either add /insim=29999 as a argument to the LFS
       shortcut/executable or open a chat prompt when running LFS, and type
       "/insim=29999". 29999 is the default port for InSim, but you may type
       anything greater than 1024 and less than 65335, and as long as it's not 
       in use it should be fine.
  - Now LFS is running you need to start xi4n. Do this as follows: `xi4n -c
    path/to/config` where path/to/config is the sme directory you created 
  - Enjoy your xi4n instance. If you want to quit out xi4n prematurely press
    ctrl+c to close it.
  - Any time you want to run xi4n in future all you need to do is run `xi4n -c
    path/to/config` 
