var chai = require('chai');
var searchanalyzer = require('../../../src/js/modules/urlblock/searchanalyzer.js');
var chrome = require('sinon-chrome');
var should = chai.should();
var assert = chai.assert;

describe('urlblock/searchanalyzer module', function () {

	before(function () {
        global.chrome = chrome;
    });

	describe('#urlcheck', function () {
		it('works with google', function() {
			searchanalyzer.urlcheck("https://www.google.co.in/search?q=porn+league&rlz=1C1CHZL_enUS755US755&oq=Justice+&aqs=chrome.0.0j69i57j0l4.2144j0j1&sourceid=chrome&ie=UTF-8").should.be.equal(0.5);
		});
		it('works with facebook', function() {
			searchanalyzer.urlcheck("https://www.facebook.com/search/pages/?q=porn%20sex").should.be.equal(0.5);
		});
		it('works with amazon', function(){
			searchanalyzer.urlcheck('http://www.amazon.in/s/ref=nb_sb_noss_2/261-1648356-6274234?url=search-alias%3Daps&field-keywords=Porn').should.be.equal(1);
		});
		it('works with youtube', function() {
			searchanalyzer.urlcheck("https://www.youtube.com/results?search_query=My+life+is+fucking+sad").should.be.equal(0.2);
		});
	});
});