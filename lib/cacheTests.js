var expect = require("chai").expect;
var cache = require("./cache.js");


describe("cache", function() {

	it("should save value", function(done) {
		cache.save({
			    key: "k1", 
			    value: "v1"
		    },
			function(err, data) {
				expect(err).to.be.null;
				expect(data).to.equal("OK");
				done();
			}
		);
	});

	it("should replace value", function(done) {
		cache.save({
			    key: "k1", 
			    value: "v2"
		    },
			function(err, data) {
				expect(err).to.be.null;
				expect(data).to.equal("OK");
				done();
			}
		);
	});

	it("should load value", function(done) {
		cache.load({ key: "k1" },
			function(err, data) {
				expect(err).to.be.null;
				expect(data).to.equal("v2");
				done();
			}
		);
	});

	it("should remove value", function(done) {
		cache.remove({ key: "k1" },
			function(err, data) {
				expect(err).to.be.null;
				expect(data).to.equal(1);
				done();
			}
		);
	});

	it("should expire value", function(done) {
		this.timeout(3000);
		cache.save({
			    key: "k2", 
			    value: "foo",
			    expire: 1 /* second */
		    },
			function(err, data) {
				expect(err).to.be.null;
				expect(data).to.equal("OK");

				setTimeout(function() {
					cache.load({ key: "k2" }, 
						function(err, data) {
							expect(err).to.be.null;
							expect(data).to.be.null;
							done();
						}
					);
				}, 2000);
			}
		);
	});
	
});