var BloomFilter = require('./libs/bloomfilter');
var assert = require('assert');

var elements = [];
for (var i = 1; i < 101; i++) {
    elements.push(i);
}

describe("BloomFilter", function() {

    describe("#constructor", function() {
        it('should construct a bloom filter from opts', function() {
            var bf = new BloomFilter({
                elements: elements,
                p: 0.0001
            });
            assert.equal(bf != null, true);
        });
        it('should construct a bloom filter from inputString', function() {
            var bf = new BloomFilter({
                elements: elements,
                p: 0.0001
            });
            var inputString = bf.toString();
            bf = new BloomFilter(inputString);
            assert.equal(bf != null, true);
        });
    });

    describe("#has", function() {
        it('should return true for every containing element', function() {
            var bf = new BloomFilter({
                elements: elements,
                p: 0.0001
            });
            assert.equal(bf != null, true);
            elements.forEach(function(val) {
                assert.equal(bf.has(val), true);
            });
            for (var i = 200; i < 301; i++) {
                assert.equal(bf.has(i), false);
            }
        });
        it('should return false for every element not in set (Probably)', function() {
            var bf = new BloomFilter({
                elements: elements,
                p: 0.0001
            });
            assert.equal(bf != null, true);
            for (var i = 200; i < 301; i++) {
                assert.equal(bf.has(i), false);
            }
        });
    });
});