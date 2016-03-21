var expect = require('chai').expect;
var fh = require('fh-mbaas-api');
var fs = require('fs');
var dummyjson = require('dummy-json');

var type = 'test-collection';
var userTemplate = fs.readFileSync('templates/user.hbs', {encoding: 'utf8'});
var user1 = JSON.parse(dummyjson.parse(userTemplate));
var user2 = JSON.parse(dummyjson.parse(userTemplate));
var user3 = JSON.parse(dummyjson.parse(userTemplate));
var user1Guid = null;


describe('Database API', function() {

  it('should delete all entities', function(done) {
    fh.db({
      'act': 'deleteall',
      'type': type
    }, function(err, data) {
      try {
        expect(err).to.be.null;
        expect(data.status).to.equal('ok');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should list empty collection', function(done) {
    fh.db({
      'act': 'list',
      'type': type
    }, function(err, data) {
      try {
        expect(err).to.be.null;
        expect(data.count).to.equal(0);
        expect(data.list).to.be.empty;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should create entity', function(done) {
    fh.db({
      'act': 'create',
      'type': type,
      'fields': user1
    }, function(err, data) {
      try {
        expect(err).to.be.null;
        expect(data.guid).to.be.a('string');
        expect(data.guid).to.have.length.above(20) ;
        user1Guid = data.guid;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should read entity', function(done) {
    fh.db({
      'act': 'read',
      'type': type,
      'guid': user1Guid
    }, function(err, data) {
      try {
        expect(err).to.be.null;
        expect(data.type).to.equal(type);
        expect(data.guid).to.equal(user1Guid);
        expect(data.fields.user.email).to.equal(user1.user.email);
        expect(data.fields.user.address).to.equal(user1.user.address);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should create multiple entities', function(done) {
    fh.db({
      'act': 'create',
      'type': type,
      'fields': [user2, user3]
    }, function(err, data) {
      try {
        expect(err).to.be.null;
        expect(data.Status).to.equal('OK');
        expect(data.Count).to.equal(2);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should list all entities', function(done) {
    fh.db({
      'act': 'list',
      'type': type
    }, function(err, data) {
      try {
        expect(err).to.be.null;
        expect(data.count).to.equal(3);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should update entity', function(done) {
    user1.user.email = 'foo@bar.com';
    fh.db({
      'act': 'update',
      'type': type,
      'guid': user1Guid,
      'fields': user1
    }, function(err, data) {
      try {
        expect(err).to.be.null;
        expect(data.type).to.equal(type);
        expect(data.guid).to.equal(user1Guid);
        expect(data.fields.user.email).to.equal('foo@bar.com');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should delete entity', function(done) {
    fh.db({
      'act': 'delete',
      'type': type,
      'guid': user1Guid
    }, function(err, data) {
      try {
        expect(err).to.be.null;
        fh.db({
          'act': 'list',
          'type': type
        }, function(err, data) {
          try {
            expect(err).to.be.null;
            expect(data.count).to.equal(2);
            done();
          } catch (e) {
            done(e);
          }
        });
      } catch (e) {
        done(e);
      }
    });
  });

});