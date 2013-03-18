# About - xi4n

------

# Introduction <small>Things you may want to know</small>

## What? <small>WTF, yo?</small>
xi4n is a cross platform (Linux, Windows, OS X, FreeBSD, Solaris), plugin based application to help write multi-server/client InSim, Outgauge and Outsim applications in javascript, on top of nodejs.

In more basic terms, xi4n allows you to interact with Live For Speed servers and clients, and manipulate the behaviour of the game.

## Why use xi4n? <small>Why invent something new?</small>
It's true, there are plenty of other frameworks or applications out there that you can use, right now, that already allow you to work with Live For Speed; PRISM, PyInSim, LFSLapper and so on.

The problem I found was that tackling the projects I wanted to, with existing projects was unnecessarily tricky; I wanted to bring Live For Speed to the web, without the need for lots of work. Nodejs suits that perfectly, and has a large eco-system of modules that can be easily dropped and in used; for instance websocket support - which was unavailable elsewhere at the time I started working on xi4n.

## Features <small>Stuff it does out of the box</small>
  - Supports InSim, Outgauge, OutSim (LFSW relay support coming shortly)
  - Automatic reconnection
  - Supports client or server as a connection
  - Multiple concurrent connections
  - Shared information between connections
  - Multiple plugins per connection
  - May be used as a library, rather than as a application

## History <small>This seems very familiar...</small>
Over the years I've played with similar projects - the one that got a few people's attention was a very similar implementation in lua, called lualFS, circa 2004. If you're reminded at all of that, it's because it's from the same brain.
