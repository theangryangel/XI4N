# xi4n exmaple/gauges-configuration
An example, minimal configuration to run the gauges (outgauge) plugin.

Assumes no admin password is set, and that it's connecting to a client, not a
server.

  - Install nodejs (if not already done)
  - git clone https://github.com/theangryangel/XI4N.git
  - cd XI4N
  - git checkout examples/gauges-configuration
  - npm install
  - cd plugins/gauges
  - npm install express@2.5.9 socket.io@0.9.6
  - cd ../..
  - Run LFS, start insim on 29999 (in LFS, press T and type /insim 29999)
  - node bin/xi4n -c .
  - Open your favourite [modern] web browser and goto http://localhost:3000
