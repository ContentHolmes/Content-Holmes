[![GitHub license](https://img.shields.io/badge/license-AGPLv3-blue.svg)](https://raw.githubusercontent.com/ContentHolmes/Content-Holmes/master/LICENSE)

# Content-Holmes-Web

Content Holmes is a content moderation solution that blocks inappropriate content, in addition to detecting depression and preventing cyber-bullying.

**PROTIP:** Visit the [website](https://www.contentholmes.com) to read about all the functionality that Content Holmes provides.

## Introduction

Children can easily be influenced by anything. With the rise of internet, children start using the web at a really young age. However, the web is not a safe place to be, more so for children, and we all know it. So, we built “Content Holmes” a content moderation solution that comes complete with a profanity filter, URL blocker, depression detector, and interest analyzer. Content Holmes has one goal - to protect children when they use the internet.

Content Holmes Web is available on Google Chrome, Mozilla Firefox, and Microsoft Edge. And you can control it from any device. The app doesn’t need anyone to steer the wheels, just install and get cracking without any hassle.

## Setting up

1. Install latest version of nodejs and npm.

2. Install the required node modules in the root directory of the project.

This can be done by:
	
	$ npm install

## Building

To initiate a continuous build process, use

	$ npm start

This builds the extension as soon as any change is made to to its source. Ideally, you should run this command before you begin changing the source files.

## Features

 - **URL Blocker:** [Source](./src/js/modules/urlblock), [Docs](./tutorial-urlblock.html)

## Contributing

**We love contributions!**

When contributing, follow the simple rules:

* Don't violate [DRY](http://programmer.97things.oreilly.com/wiki/index.php/Don%27t_Repeat_Yourself) principles.
* [Boy Scout Rule](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule) needs to have been applied.
* Your code should look like all the other code – this project should look like it was written by one person, always.
* If you want to propose something – just create an issue and describe your question with as much description as you can.
* If you think you have some general improvement, consider creating a pull request with it.
* If you add new code, it should be covered by tests. No tests – no code.
* If you add a new feature, don't forget to update the documentation for it.
* If you find a bug (or at least you think it is a bug), create an issue with the library version and test case that we can run and see what are you talking about, or at least full steps by which we can reproduce it.

## License

All Content Holmes source code is made available under the terms of the GNU Affero Public License (GNU AGPLv3).