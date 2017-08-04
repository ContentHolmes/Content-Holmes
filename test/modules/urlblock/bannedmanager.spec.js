var chai = require('chai');
var bannedmanager = require('../../../src/js/modules/urlblock/bannedmanager.js');
var chrome = require('sinon-chrome');

chai.use(require('chai-as-promised'));
var should = chai.should();
var assert = chai.assert;

describe('urlblock/bannedmanager module', function () {

	before(function () {
        global.chrome = chrome;
    });

	describe('#add', function () {
		it('adds a website to the extension local storage', function () {
			bannedmanager.add("http://www.contentholmes.com");
			// assert.equal(chrome.storage.local.get.calledOnce,true);
			// assert.equal(chrome.storage.local.set.calledOnce,true);
			// assert.equal(chrome.storage.local.get)
		});
	});

	describe('#checkPresenceInBanned', function() {
		it('returns true when the website is present', function(done) {
			bannedmanager.checkPresenceInBanned("http://www.contentholmes.com").then(function(result) {
				result.should.equal(true);
				done();
			}, function (err) {
				done(err);
			});
		});
		it('returns false when the website is absent', function() {
			bannedmanager.checkPresenceInBanned("http://www.contentholmes.com").should.eventually.equal(false);
		});
	});
});