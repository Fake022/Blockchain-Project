'use strict';
var models = require('../../models');

class Node {
    constructor(txNr, Amount, Fee, From, To, Signature) {
        this.txNr = txNr;
        this.Amount = Amount;
        this.Fee = Fee;
        this.From = From;
        this.To = To;
        this.Signature = Signature;
    }
}

module.exports = class Mempool {
    constructor() {
        this.list = [];
    }

    async init() {
       var list = await models.Transaction.findAll().then((rows) => {
           return rows.map((r) => {
               return r.dataValues;
            });
        });
        console.log(list.length);
        if (typeof list !== 'undefined' && list.length > 0) {
            list.forEach(transaction => {
                this.list.push(new Node(transaction.txNr, transaction.Amount, transaction.Fee, transaction.From, transaction.To, transaction.Signature));
            });
        }
    }

    async updateNode() {
        var new_list = await models.Transaction.findAll().then((rows) => {
            return rows.map((r) => {
                return r.dataValues;
             });
         });
        if (typeof new_list !== 'undefined' && new_list.length > 0) {
            this.list = new_list;
        }
        return this.list;
    }

    async checkNewNode() {
        var new_list = await models.Transaction.findAll().then((rows) => {
            return rows.map((r) => {
                return r.dataValues;
             });
         });
        if (list.length !== new_list.length) {
            return true;
        }
        return false;
    }

    getCurrentList() {
        return this.list;
    }
}