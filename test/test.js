'use strict';

const expect = require('chai').expect;
const customParams = require('../index');


describe('Custom parameters', function() {

  describe('Add custom parameter', function() {

    it('add customParams with next function call next', function(done) {
      const req = {};
      const dummy = {};
      function next () {
        expect(req).to.respondTo('setPrm');
        done();
      }
      customParams()(req, dummy, next);
    });
    it('add customParams with next that is not a function', function() {
      const req = {};
      const dummy = {};
      const next = 42;
      customParams()(req, dummy, next);
      expect(req).to.respondTo('setPrm');
    });
    it('add customParams without next', function() {
      const req = {};
      customParams()(req);
      expect(req).to.respondTo('setPrm');
    });
    it('add customParams for something that is not an object', function() {
      const req = true;
      customParams()(req);
      expect(req).to.not.have.property('setPrm');
    });

  });

  describe('Add custom parameter with an id', function() {
    it('add customParams with id', function() {
      const req = {};
      customParams('id')(req);
      expect(req).to.respondTo('setPrm');
      req.setPrm('foo', 42);
      expect(req[Symbol.for('id')]).to.have.property('foo', 42);
    });
  });

  describe('Custom parameter functions', function() {

    it('add customParams add 4 methods', function(done) {
      const req = {};
      const dummy = {};
      function next () {
        expect(req).to.respondTo('setPrm');
        expect(req).to.respondTo('getPrm');
        expect(req).to.respondTo('deletePrm');
        expect(req).to.respondTo('hasPrm');
        done();
      }
      customParams()(req, dummy, next);
    });
    it('functions returns undefined if not set', function() {
      const req = {};
      customParams()(req);
      expect(req.hasPrm('foo')).to.be.false;
      expect(req.getPrm('foo')).to.be.undefined;
      expect(req.deletePrm('foo')).to.be.undefined;
      expect(req.hasPrm('foo')).to.be.false;
    });
    it('functions works with value', function() {
      const req = {};
      customParams()(req);
      expect(req.setPrm('foo', 'bar')).to.equals(req);
      expect(req.hasPrm('foo')).to.be.true;
      expect(req.getPrm('foo')).to.equal('bar');
      expect(req.deletePrm('foo')).to.equal('bar');
      expect(req.hasPrm('foo')).to.be.false;
    });
    it('functions works with object', function() {
      const req = {};
      customParams()(req);
      expect(req.setPrm('foo', { baz: [ 'bar' ] })).to.equal(req);
      expect(req.getPrm('foo')).to.deep.equal({ baz: [ 'bar' ] });
      expect(req.getPrm('foo', 'baz')).to.deep.equal([ 'bar' ] );
      expect(req.getPrm('foo', 'baz', 0)).to.equal('bar');
    });
    it('without keys should use undefined as key', function() {
      const req = {};
      customParams()(req);
      expect(req.getPrm()).to.be.undefined;
      expect(req.setPrm(undefined, 'bar')).to.equal(req);
      expect(req.hasPrm()).to.be.true;
      expect(req.getPrm()).to.equal('bar');
      expect(req.deletePrm()).to.equal('bar');
      expect(req.hasPrm()).to.be.false;
    });

  });

});