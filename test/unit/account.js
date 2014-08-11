/* jshint expr: true */
/* global describe, it, before, beforeEach */
'use strict';

var expect    = require('chai').expect;
var Account   = require('../../app/models/account');
var dbConnect = require('../../app/lib/mongodb');
var Mongo     = require('mongodb');
var cp        = require('child_process');
var db        = 'bankr-test';
var aliceID = '000000000000000000000001';

describe('Account', function(){
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
    it('should accept an object and create an account with proper attributes', function(){
      var o = {name:'bob smith', photo:'google.com/picture.jpg', type:'Checking', color:'#FF4136', pin:'1990', deposit:'500'};
      var a = new Account(o);
      expect(a).to.be.instanceof(Account);
      expect(a.date).to.respondTo('getDay');
      expect(a.name).to.equal('bob smith');
      expect(a.photo).to.equal('google.com/picture.jpg');
      expect(a.type).to.equal('Checking');
      expect(a.color).to.equal('#FF4136');
      expect(a.pin).to.equal('1990');
      expect(a.balance).to.equal(500);
      expect(a.transfers).to.have.length(0);
      expect(a.transfers).to.be.instanceof(Array);
      expect(a.transactions).to.have.length(0);
      expect(a.transactions).to.be.instanceof(Array);
      //console.log(a.date);
    });
  });
  describe('#transaction', function(){
    it('should add to balance and add a new transaction object to transactions array', function(){
      var o = {name:'bob smith', photo:'google.com/picture.jpg', type:'Checking', color:'#FF4136', pin:'1990', deposit:'500'};
      var a = new Account(o);
      var to = {type:'deposit', amount:'500', pin:'1990'};
      a.transaction(to);
      expect(a.transactions).to.have.length(1);
      expect(a.transactions[0].type).to.equal('deposit');
      expect(a.transactions[0].id).to.equal(1);
      expect(a.transactions[0].date).to.respondTo('getDay');
      expect(a.transactions[0].amount).to.equal(500);
      expect(a.transactions[0].fee).to.equal(0);
      expect(a.balance).to.equal(1000);
    });
    it('should charge a $50 fee if withdrawal amt > balance', function(){
      var o = {name:'bob smith', photo:'google.com/picture.jpg', type:'Checking', color:'#FF4136', pin:'1990', deposit:'50'};
      var a = new Account(o);
      var to = {type:'withdraw', amount:'500', pin:'1990'};
      a.transaction(to);

      expect(a.transactions).to.have.length(1);
      expect(a.transactions[0].type).to.equal('withdraw');
      expect(a.transactions[0].id).to.equal(1);
      expect(a.transactions[0].date).to.respondTo('getDay');
      expect(a.transactions[0].amount).to.equal(500);
      expect(a.transactions[0].fee).to.equal(50);
      //console.log(a.transactions[0]);
      expect(a.balance).to.equal(-500);
    });
    it('should do nothing if pin is incorrect', function(){
      var o = {name:'bob smith', photo:'google.com/picture.jpg', type:'Checking', color:'#FF4136', pin:'1990', deposit:'500'};
      var a = new Account(o);
      var to = {type:'deposit', amount:'500', pin:'2000'};
      a.transaction(to);
      expect(a.transactions.length).to.equal(0);
      expect(a.balance).to.equal(500);
    });
  });
  describe('Account.create', function(){
    it('should create and save a new account to the db', function(done){
      var o = {name:'bob smith1', photo:'google.com/picture.jpg', type:'Checking', color:'#FF4136', pin:'1990', deposit:'500'};
      Account.create(o, function(err, account){
        expect(account._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('account.findbyId', function(){
    it('should return one account, with attached transfers', function(done){
      Account.findById(aliceID, function(account){
        //console.log(account);
        //console.log(account);
        //console.log('Transfers:');
        //console.log(account.transfers);
        expect(account).to.be.instanceof(Account);
        expect(account.name).to.equal('Alice');
        done();
      });
    });
  });
  describe('.transfer', function(){
    it('should transfer funds from one account to another', function(done){
      Account.transfer({from:'000000000000000000000002', to:'000000000000000000000003', amount: '50', pin:'1234'}, function(){
        Account.findById('000000000000000000000002', function(sender){
          //console.log(sender);
          expect(sender.balance).to.be.closeTo(525, 0.1);
          expect(sender.transfers.length).to.equal(3);
          Account.findById('000000000000000000000003', function(receiver){
            //console.log(receiver);
            expect(receiver.balance).to.be.closeTo(750, 0.1);
            expect(receiver.transfers.length).to.equal(3);
            done();
          });
        });
      });
    });
    it('should not transfer funds, wrong pin', function(done){
      Account.transfer({from:'000000000000000000000002', to:'000000000000000000000003', amount: '50', pin:'1000'}, function(){
        Account.findById('000000000000000000000002', function(sender){
          //console.log(sender);
          expect(sender.balance).to.be.closeTo(600, 0.1);
          expect(sender.transfers.length).to.equal(2);
          Account.findById('000000000000000000000003', function(receiver){
            //console.log(receiver);
            expect(receiver.balance).to.be.closeTo(700, 0.1);
            expect(receiver.transfers.length).to.equal(2);
            done();
          });
        });
      });
    });
    it('should not transfer funds, not enough money', function(done){
      Account.transfer({from:'000000000000000000000002', to:'000000000000000000000003', amount: '5000', pin:'1234'}, function(){
        Account.findById('000000000000000000000002', function(sender){
          //console.log(sender);
          expect(sender.balance).to.be.closeTo(600, 0.1);
          expect(sender.transfers.length).to.equal(2);
          Account.findById('000000000000000000000003', function(receiver){
            //console.log(receiver);
            expect(receiver.balance).to.be.closeTo(700, 0.1);
            expect(receiver.transfers.length).to.equal(2);
            done();
          });
        });
      });
    });
  });
});
