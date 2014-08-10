/* jshint expr: true */
/* global describe, it */
'use strict';

var Transfer = require('../../app/models/transfer');
var expect = require('chai').expect;
var Mongo = require('mongodb');

describe('Transfer', function(){
  describe('constructor', function(){
    it('should create a new transfer', function(){
      var o = {from:'000000000000000000000001',to:'000000000000000000000002', amount: '500', id:'1'};
      var t = new Transfer(o);
      expect(t).to.be.instanceof(Transfer);
    });
  });
  describe('create', function(){
    it('should create and save a new transfer', function(){
      var o = {from:'000000000000000000000001',to:'000000000000000000000002', amount: '500', id:'1'};
      Transfer.create(o, function(err, transfer){
        expect(transfer._id).to.be.instanceof(Mongo.ObjectID);
      });
    });
  });
});


