# Bloom Filter for Javascript

This package contains bloom filter worked in both browser and Node.js, the hash function is default to be MurmurHash3 hashing the obj.toString().

## Installation

    npm install bloom-filter

## Usage

    var BloomFilter = require('bloom-filter');
    var bf = new BloomFilter({
        elements: [1, 2, 3],
        p: 0.001 // default value of false positive rate
    });
    bf.has(1) // true

## API

### Constructors

#### BloomFilter(opts)

An example of parameter:

    {
        elements: [...], // required, Array
        p: 0.01, // optianal, Number, 0 to 1, exclusive,
        hash: function(str, seed) {...} // optianal, hash function supporting seed
    }

#### BloomFilter(inputString[, hashFunc])

1. `inputString`: the result of `BloomFilter.prototype.toString()`
2. `hashFunc`: hash function supporting seed

### Methods

#### has(obj)

return true if the instance constains the obj.

#### toString()

return a hex string of this bloom filter

## Notice

Hashing function takes the result of elements' toString() result as input by default. However, you can implements your own hash function.


