# 6-mils changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2020-10-22

### Changed

* The methods `setBuyerInfo`, `setSupplierInfo`, and `setSenderInfo` now throw an error if `null` or `undefined` values are provided for any options. I felt that the original behavior was misleading at best, or at worst, could allow a simple typographical error to lead to hours and hours of misdirected troubleshooting (ask me how I know this). Although I think that the original behavior was a "bug", this seems like a breaking change to me, hence its inclusion in a semver-major release.

### Removed

* Removed support for Node.js version 8, since it has reached [end-of-life](https://nodejs.org/en/about/releases/).

## [1.1.1] - 2020-10-04

### Fixed

* [#5](https://github.com/DPassarelli/6-mils/issues/5)

## [1.1.0] - 2020-09-04

Although it doesn't affect the version number, the library has undergone a major refactorization, which should make future maintenance easier. It also brought in a couple of new features 🙌 

### Added

* Instances of `PunchOutOrderMessage` now have a `query()` method that allows the source cXML to be directly queried through the use of XPath expressions. This provides access to data that is not otherwise exposed through the limited set of property getters. Please refer to the documentation for more information about this new method.

* Instances of `PunchOutSetupRequest` and `OrderRequest` now emit events that provide visibility into the cXML that is sent and received from suppliers. This may be useful for logging or trouble-shooting. Please refer to the documentation for more information about these new events.

## [1.0.1] - 2020-09-01

### Fixed

* If the `<ShortName>` element was missing from an item's description, this would cause an exception when creating a new instance of `PunchOutOrderMessage`. This has been fixed, and the behavior for setting the values of `description` and `name` now matches the documentation correctly. ([#3](https://github.com/DPassarelli/6-mils/issues/3))

## [1.0.0] - 2020-05-21

First release.
