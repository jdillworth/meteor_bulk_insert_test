# meteor_bulk_insert_test

I created this issue to highlight an apparent issue with Meteor.

When MongoDB documents are created by a bulk insert, it seems that Meteor cannot later select those documents by \_id and modify them in another bulk operation.

Checkout the code, cd, run "meteor".

# Fix?

I've updated the code to set string \_ids on some records. This solves the issues for those records.
