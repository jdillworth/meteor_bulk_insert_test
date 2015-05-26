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
      // normal inserts
      Rocks.insert({name:'Obsidian', fromBulk:false});
      Rocks.insert({name:'Pumice', fromBulk:false});


      var bulkOp = Rocks.rawCollection().initializeUnorderedBulkOp();

      // these records work in meteor, explicitly set string _id and then we're good
      bulkOp.insert({_id:Rocks._makeNewID(), name:'Quartz', fromBulk:true, usingMeteorId:true});
      bulkOp.insert({_id:Rocks._makeNewID(), name:'Granite', fromBulk:true, usingMeteorId:true});

      // Currently, when I try to use Mongo.ObjectID, I get this error in an infinite loop:
      // Got exception while polling query:
      // Error: Meteor does not currently support objects other than ObjectID as ids
      // -- so the below documents are commented out
      // bulkOp.insert({_id:new Mongo.ObjectID(), name:'Rhyolite', fromBulk:true, usingObjectID:true});
      // bulkOp.insert({_id:new Mongo.ObjectID(), name:'Norite', fromBulk:true, usingObjectID:true});

      // These documents don't seem to work with Meteor
      bulkOp.insert({name:'Marble', fromBulk:true});
      bulkOp.insert({name:'Flint', fromBulk:true});


      bulkOp.execute(function() {});

    }

  });
}
