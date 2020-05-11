# 6-mils

[![Linux Build Status](https://img.shields.io/travis/DPassarelli/6-mils/master?label=Linux%20build&logo=travis)](https://travis-ci.org/DPassarelli/6-mils)
[![Windows Build Status](https://img.shields.io/appveyor/build/DPassarelli/6-mils/master?label=Windows%20build&logo=appveyor)](https://ci.appveyor.com/project/DPassarelli/6-mils)
[![Coverage Status](https://img.shields.io/coveralls/github/DPassarelli/6-mils/master?logo=coveralls)](https://coveralls.io/github/DPassarelli/6-mils?branch=master)


**A Node.js library for creating, sending, and parsing [cXML messages](http://cxml.org).**

This project adheres to the `standard` coding style (click below for more information):

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard#javascript-standard-style)


## Getting Started

This library contains classes for several different types of cXML messages. Some of them are intended for parsing, and some for creating/sending:

### `PunchOutSetupRequest`

This class is used to create and send a request to initiate a new Punch Out session.

### `PunchOutOrderMessage`

This class is used to parse incoming `PunchOutOrderMessage` cXML documents.

### Examples

Please refer to the contents of `test/functional/` for examples of this library in use.


## Technical Documentation

Please refer to the `docs/` sub-folder. There are separate entries for each object in this library.


## cXML Concepts

### General

cXML is used to transmit information between the computer systems of purchasers (buyers) and their suppliers (sellers).

### Punch Out

In cXML, a "punch out" means automating the process of accessing a supplier's online catalog. Typically, the catalog will be customized in such a way that it only shows the products, services, and prices that are specific to the supplier's arrangement with the buyer. 


## License

Please refer to `LICENSE`.
