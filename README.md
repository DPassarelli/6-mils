# 6-mils

[![Linux Build Status](https://img.shields.io/travis/DPassarelli/6-mils/master?label=Linux%20build&logo=travis)](https://travis-ci.org/DPassarelli/6-mils)
[![Windows Build Status](https://img.shields.io/appveyor/build/DPassarelli/6-mils/master?label=Windows%20build&logo=appveyor)](https://ci.appveyor.com/project/DPassarelli/6-mils)
[![Coverage Status](https://img.shields.io/coveralls/github/DPassarelli/6-mils/master?logo=coveralls)](https://coveralls.io/github/DPassarelli/6-mils?branch=master)


**A Node.js library for creating, sending, and parsing [cXML messages](http://cxml.org).** Note that this library is not a complete implementation of all cXML features. It is currently designed to be used as a client (buyer to seller) instead of a server (seller to buyer).

This project adheres to the `standard` coding style (click below for more information):

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard#javascript-standard-style)


## Getting Started

This library contains classes for several different types of cXML messages. Some of them are intended for parsing, and some for creating/sending:

### `PunchOutSetupRequest`

This class is used to create and send a request to initiate a new Punch Out session.

### `PunchOutOrderMessage`

This class is used to parse incoming `PunchOutOrderMessage` cXML documents.

### `OrderRequest`

This class is used to create and send purchase orders.

### Examples

Please refer to the contents of `test/functional/` for examples of this library in use.


## Technical Documentation

Please refer to the `docs/` sub-folder. There are separate entries for each object in this library.


## Name

While dreaming up a name for this module, I thought "cx" could be vocalized as "six". "ml" could be considered the same as "mL" (milliliter), which in some locations is said as "mil". It could also mean that this library is only 0.006" thick. Either way, I think it sounds more catchy than "cxml".


## License

Please refer to `LICENSE`.
