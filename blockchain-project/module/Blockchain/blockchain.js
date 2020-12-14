'use strict';

const SHA256 = require('crypto-js/sha256');

class CryptoBlock {

    constructor(index, timestamp, data, precedingHash=" "){
     this.index = index;
     this.timestamp = timestamp;
     this.data = data;
     this.precedingHash = precedingHash;
     this.hash = this.computeHash();     
    }

    computeHash(){
        return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data)).toString();
    }   

    proofOfWork(difficulty) {
        while (
          this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
          this.nonce++;
          this.hash = this.computeHash();
        }
    }
}

module.exports = class Blockchain {
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
    }

    startGenesisBlock () {
        return new Blockchain(0, Date.now(), "Initial Block in the Chain", "0");
    }

    obtainLatestBlock(){
        return this.blockchain[this.blockchain.length - 1];
    }

    addNewBlock(newBlock){
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }

    checkChainValidity(){
        for(let i = 1; i < this.blockchain.length; i++){
            const currentBlock = this.blockchain[i];
            const precedingBlock= this.blockchain[i-1];

          if(currentBlock.hash !== currentBlock.computeHash()){
              return false;
          }
          if(currentBlock.precedingHash !== precedingBlock.hash)
            return false;
        }
        return true;
    }

}