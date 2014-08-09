'use strict';

function Account(o){
  this.name = o.name;
  this.date = new Date(o.date);
  this.photo = o.photo;
  this.type = o.type;
  this.color = o.color;
  this.pin = o.pin;
  this.balance = o.deposit * 1;
  this.transfers = [];
  this.transactions = [];
}

module.exports = Account;
