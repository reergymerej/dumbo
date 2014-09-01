'use strict';

var records;
var _id;

var getIndex = function (_id) {
    var index;
    var i = 0;
    var max = records.length;

    for (; i < max; i++) {
        if (records[i]._id === _id) {
            index = i;
            break;
        }
    }

    return index;
};

/**
* @name create
* @description Insert a record.
* @param {Object} record
* @return {Object} record with _id and _modified
*/
exports.create = function (record) {
    record._id = _id++;
    record._modified = Date.now();
    records.push(record);
    return record;
};

/**
* @name read
* @description Read records from the "database".
* @param {Number} [_id] if provided, return record with this _id.
* @return {Object/Object[]}
*/
exports.read = function (_id) {
    var result;

    if (_id === undefined) {
        result = records;
    } else {
        _id = parseInt(_id, 10);
        result = records[getIndex(_id)];
    }

    return result;
};

/**
* @name update
* @description Update a record.
* @param {Number} _id
* @param {Object} values
*/
exports.update = function (_id, data) {
    var record;
    _id = parseInt(_id, 10);
    record = records[getIndex(_id)];

    Object.keys(data).forEach(function (key) {
        record[key] = data[key];
    });

    // overwrite the time stamp
    record._modified = Date.now();
    return record;
};

/**
* @name delete
* @description Delete a record.
* @param {Number} _id
* @return {Boolean}
*/
exports.delete = function (_id) {
    var index = getIndex(_id);
    var success = false;

    if (index !== undefined) {
        records.splice(index, 1);
        success = true;
    }

    return success;
};

/**
* @name purge
* @description Delete all records and reset _id counter.
*/
exports.purge = function () {
    records = [];
    _id = 0;
};

// initialize everything
exports.purge();