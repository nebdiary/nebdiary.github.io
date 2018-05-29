"use strict"

var DiaryContract = function() {
    // the diaries by the writer address.
    LocalContractStorage.defineMapProperty(this, "diaryMap");
    // The writer name by the writer address.
    LocalContractStorage.defineMapProperty(this, "writers");
    // The secret by the writer address.
    LocalContractStorage.defineMapProperty(this, "secrets");
    // The contract creator.
    LocalContractStorage.defineProperty(this, "superuser");
}

DiaryContract.prototype = {
    init: function() {
        this.superuser = Blockchain.transaction.from;
        console.log('init: Blockchain.block.coinbase = ' + Blockchain.block.coinbase);
        console.log('init: Blockchain.block.hash = ' + Blockchain.block.hash);
        console.log('init: Blockchain.block.height = ' + Blockchain.block.height);
        console.log('init: Blockchain.transaction.from = ' + Blockchain.transaction.from);
        console.log('init: Blockchain.transaction.to = ' + Blockchain.transaction.to);
        console.log('init: Blockchain.transaction.value = ' + Blockchain.transaction.value);
        console.log('init: Blockchain.transaction.nonce = ' + Blockchain.transaction.nonce);
        console.log('init: Blockchain.transaction.hash = ' + Blockchain.transaction.hash);
    },

    checkSecret: function(writer, secret) {
      // Set or check the secret.
      if (!this.secrets.get(writer)) {
        this.secrets.set(writer, secret);
        return true;
      } else if(this.secrets.get(writer) != secret) {
        return false;
      }
      return true;
    },

    add: function(date, diary, wheather, mood, secret) {
        var writer = Blockchain.transaction.from;
        if(!this.checkSecret(writer, secret)) {
          return;
        }

        // the diary body
        var diaryBody = {
          date: date,
          diary: diary,
          wheather: wheather,
          mood: mood
        };

        if (!this.writers.get(writer)) {
            this.writers.set(writer, writer);
        }

        if(!this.diaryMap.get(writer)) {
          this.diaryMap.set(writer, [diaryBody]);
        } else {
          var tmpDiaries = this.diaryMap.get(writer);
          tmpDiaries.push(diaryBody);
          this.diaryMap.set(writer, tmpDiaries);
        }
    },

    setWriterName: function(name, secret) {
        var writer = Blockchain.transaction.from;
        if(!this.checkSecret(writer, secret)) {
          return;
        }
        if (!name) {
            throw new Error("Empty Name not allowed!");
        }
        this.writers.set(writer, name);
    },

    getWriterName: function(secret) {
      var writer = Blockchain.transaction.from;
      if(!this.checkSecret(writer, secret)) {
        return;
      }
      var name = this.writers.get(writer) || writer;
      return name;
    },

    getDiaries: function(secret) {
        var writer = Blockchain.transaction.from;
        if(!this.checkSecret(writer, secret)) {
          return;
        }
        var diaries = this.diaryMap.get(writer) || [];
        return diaries;
    }
};

module.exports = DiaryContract;
