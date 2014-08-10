/* jshint expr: true */
/* global describe, it, before, beforeEach */
'use strict';

var Transfer = require('../../app/models/transfer');
var expect = require('chai').expect;
var Mongo = require('mongodb');
var cp        = require('child_process');
var db        = 'bankr-test';
var dbConnect = require('../../app/lib/mongodb');

describe('Transfer', function(){
  before( function(done){
    dbConnect(db, function(){
      done();
    });
  });
  beforeEach( function(done){
    cp.execFile(__dirname + '/../scripts/freshdb.sh', [db], {cwd:__dirname + '/../scripts'}, function(){
      done();
    });
  });
  describe('constructor', function(){
    it('should create a new transfer', function(){
      var o = {from:'000000000000000000000001',to:'000000000000000000000002', amount: '500', id:'1'};
      var t = new Transfer(o);
      expect(t).to.be.instanceof(Transfer);
    });
  });
  describe('.create', function(){
    it('should create and save a new transfer', function(done){
      var o = {from:'000000000000000000000001',to:'000000000000000000000002', amount: '500', id:'1'};
      Transfer.create(o, function(err, transfer){
        expect(transfer._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('.findById', function(){
    it('should return one transfer', function(done){
      Transfer.findById('100000000000000000000001', function(transfer){
        //console.log(transfer);
        //console.log(typeof(transfer.to));
        expect(transfer.to.toString()).to.equal('000000000000000000000002');
        expect(transfer.to).to.be.instanceof(Mongo.ObjectID); 
        done();
      });
    });
  });
});


