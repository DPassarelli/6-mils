# 6-mils changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2020-09-01

### Fixed

* If the `<ShortName>` element was missing from an item's description, this would cause an exception when creating a new instance of `PunchOutOrderMessage`. This has been fixed, and the behavior for setting the values of `description` and `name` now matches the documentation correctly. ([#3](https://github.com/DPassarelli/6-mils/issues/3))

## [1.0.0] - 2020-05-21

First release.
