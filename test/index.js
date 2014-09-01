'use strict';

/* global describe, it, beforeEach, afterEach */

var dumbo = require('../index.js');
var willy = require('willy');
var will = willy.will;

willy.addTest(function beMoreThan (expectedValue) {
    return this.if(

        // a function passed the value being tested
        function (actualValue) {

            // return the result of your test
            return actualValue > expectedValue;
        },

        // a string explaining what you were testing
        'be more than',

        // the value tested (optional)
        expectedValue
    );
});

describe('sanity', function () {
    it('should load', function () {
        will(dumbo).exist();
    });

    it('should have no records', function () {
        var records = dumbo.read();
        will(records.length).be(0);
    });
});

describe('purging', function () {
    beforeEach(function () {
        dumbo.create({ a: 1 });
    });

    it('should remove the records', function () {
        dumbo.purge();
        will(dumbo.read().length).be(0);
    });

    it('should reset the _id counter', function () {
        var id = dumbo.read()._id;

        dumbo.purge();
        will(id).be(dumbo.read()._id);
    });
});

describe('crud', function () {
    var records = [];

    beforeEach(function () {
        var max = 6;

        while (max--) {
            records.push(dumbo.create({
                a: 1,
                b: 2,
                c: 3
            }));
        }
    });

    afterEach(function () {
        dumbo.purge();
    });

    describe('creating records', function () {
        var record;

        beforeEach(function () {
            var foo = {
                a: 1,
                b: 2,
                c: 3
            };

            record = dumbo.create(foo);
        });

        afterEach(function () {
            dumbo.purge();
        });

        it('should create records', function () {
            will(record).exist();
        });

        it('should have an _id field', function () {
            will(record._id).exist();
        });

        it('should have a _modified field (timestamp)', function () {
            will(record._modified).exist();
        });

        it('should increment the _id field', function () {
            will(record._id + 1).be(dumbo.create({ a: 1 })._id);
        });
    });

    describe('reading records', function () {
        it('should be able to find all records', function () {
            will(dumbo.read().length).be(6);
        });

        it('should be able to find a record by _id', function () {
            will(dumbo.read(3)._id).be(3);
        });

        it('should return undefined if a record is not found', function () {
            will(dumbo.read(999)).be(undefined);
        });
    });

    describe('updating records', function () {
        var record;

        beforeEach(function () {
            record = records[0];
        });

        it('should be able to update a record', function () {
            will(function () {
                dumbo.update(record._id, {
                    a: 'asdf'
                });
            }).not.throw();
        });

        it('should return the updated record', function () {
            var updated = dumbo.update(record._id, {
                a: 1
            });

            will(updated).exist();
        });

        it('should update the _modified timestamp', function (done) {
            var ts = record._modified;
            var updated = dumbo.update(record._id, {
                a: 1234
            });

            setTimeout(function () {
                will(updated._modified).beMoreThan(ts);
                done();
            }, 10);
        });

        it('should overwrite existing values', function () {
            var a = record.a;
            var updated = dumbo.update(record._id, {
                a: 'updated value'
            });
            will(updated.a).be('updated value');
        });
    });

    describe('deleting records', function () {
        it('should work by _id', function () {
            var count = dumbo.read().length;
            dumbo.delete(0);
            will(count).beMoreThan(dumbo.read().length);
        });

        it('should return true when successful', function () {
            will(dumbo.delete(0)).be(true);
        });

        it('should return false when unsuccessful', function () {
            will(dumbo.delete(100)).be(false);
        });
    });
});

