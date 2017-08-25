var chai = require('chai');
var trustedmanager = require('../../../src/js/modules/urlblock/trustedmanager.js');
var chrome = require('sinon-chrome');
var sinon = require('sinon');
var lfu = require('lfu-cache')();
var md5 = require('md5');
var should = chai.should();
var assert = chai.assert;

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

describe('urlblock/trustedmanager module', function () {

	lfu.set(md5('contentholmes'), {url: "contentholmes"});

	before(function () {
        global.chrome = chrome;
    });

    beforeEach(function () {
        chrome.storage.local.get.flush();
        chrome.storage.local.set.flush();

		var globalObj = {
				trustedURLs: lfu.export(),
				trustedURLObj: {}
		};
		globalObj.trustedURLObj[md5("bing")] = "bing";

		chrome.storage.local.get.yields({"global": globalObj});
    });

	describe('#add', function () {
		it('adds a website to the trustedmanager', function () {
			trustedmanager.add("yahoo");
			chrome.storage.local.get.should.have.been.calledOnce;
			chrome.storage.local.set.should.have.been.calledOnce;
		});
	});

	describe('#checkPresenceInTrusted', function() {
		it('returns true when the website is present in array', function(done) {
			trustedmanager.checkPresenceInTrusted("google").should.eventually.equal(true).notify(done);
		});
		it('returns true when the website is in lfu-cache', function(done) {
			trustedmanager.checkPresenceInTrusted("contentholmes").should.eventually.equal(true).notify(done);
		});
		it('returns true when the website is in object array', function(done) {
			trustedmanager.checkPresenceInTrusted("bing").should.eventually.equal(true).notify(done);
		});
		it('returns false when the website is absent', function(done) {
			trustedmanager.checkPresenceInTrusted("pornhub").should.eventually.equal(false).notify(done);
		});
		it('rejects when URL is null', function(done) {
			trustedmanager.checkPresenceInTrusted(null).should.be.rejected.notify(done);
		});
	});

	after(function () {
        chrome.flush();
        delete global.chrome;
    });
});