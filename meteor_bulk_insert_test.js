Rocks = new Meteor.Collection('rocks');

if (Meteor.isClient) {
  Template.rocklist.helpers({
    rocks: function () {
      var rocks = [];
      Rocks.find({}).forEach(function(r) {
        rocks.push({rock:r, json:JSON.stringify(r)});
      });
      return rocks;
    }
  });

  Template.rocklist.events({
    'click #set':function(ev) {
      var k = $('input[name="key"]').val();
      var v = $('input[name="value"]').val();
      Meteor.call('setKVOnRocks', k, v);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      setKVOnRocks:function(k, v) {
        var bulkOp = Rocks.rawCollection().initializeUnorderedBulkOp();
        var changes = {};
        changes[k] = v;

        Rocks.find({}).forEach(function(r) {
          bulkOp.find({_id:r._id}).update({$set:changes});
        });

        bulkOp.execute(function() {});
      }
    });

    if (Rocks.find({}).count() === 0) {
      console.info('adding rocks via Meteor.Collection');
      // normal inserts
      Rocks.insert({name:'Obsidian', fromBulk:false});
      Rocks.insert({name:'Pumice', fromBulk:false});

      console.info('adding rocks via MongoDB collection bulk operation');
      var bulkOp = Rocks.rawCollection().initializeUnorderedBulkOp();
      bulkOp.insert({name:'Quartz', fromBulk:true});
      bulkOp.insert({name:'Granite', fromBulk:true});

      bulkOp.execute(function() {});

    }

  });
}
