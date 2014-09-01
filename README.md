# Dumbo

Sometimes you're not ready to connect the data layer.  Use **Dumbo** when you want to mock some persistence no-sql style.  Records are only kept in memory.  This way you can focus on writing your [REST](http://en.wikipedia.org/wiki/Representational_state_transfer) interface and worry about storage later.

## Usage

    var dumbo = require('dumbo');

The basic [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) methods make up **Dumbo**'s interface.


### Create
`create` saves a record.
The returned value has `_id` (a unique numeric value) and `_modifed` (a Unix timestamp).

    var record = dumbo.create({
        foo: 'bar'
    });

    console.log(record);
    // { foo: 'bar', _id: 0, _modified: 1409575710381 }

### Read
`read` finds a record by _id.
Omitting `_id` returns an array of all records.

    console.log(dumbo.read(record._id));
    // { foo: 'bar', _id: 0, _modified: 1409575710381 }

    console.log(dumbo.read());
    // [ { foo: 'bar', _id: 0, _modified: 1409576097584 } ]

### Update
`update` modifies an existing record by `_id`.

    record = dumbo.update(record._id, {
        foo: 'bar2',
        baz: 'quux'
    });

    console.log(record);
    // { foo: 'bar2', _id: 0, _modified: 1409579934032, baz: 'quux' }

### Delete
`delete` removes a record by `_id`.

    dumbo.delete(record._id);

    console.log(dumbo.read());
    // []
