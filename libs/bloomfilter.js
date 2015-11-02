/**
 * Implementation of Bloom Filter according to:
 * https://en.wikipedia.org/wiki/Bloom_filter
 */

"use strict";

var bigInt = require("big-integer");

// bitwise optrators operates on 32bit ints.
var SAFE_BITS_LENGTH = 32;
// the last 32bit prime number.
var PRIME_NUMBER = 4294967291;

function __getType(obj) {
    var __type = Object.prototype.toString.apply(obj);
    return __type.slice(__type.indexOf(' ') + 1, __type.length - 1);
}

function __getDefaultHashFunction() {
    var hashFunc = require('non-crypto-hash/libs/murmurhash3').hash;
    return function(obj, seed) {
        if (__getType(obj) != 'String') {
            obj = obj.toString();
        }
        return hashFunc(obj, seed);
    }
}

function __intToUnsignedHex(number) {
    var temp;
    var hexArray = [];
    while ((temp = number & 0xffff) || number) {
        temp = temp.toString(16);
        temp = '0000'.slice(temp.length) + temp;
        hexArray.push(temp);
        number >>>= 16;
    }
    return hexArray.reverse().join('');
}

function __unsignedHexToInt(hexString) {
    var tempN = 0;
    var hexString = hexString.replace(/^0+/g, '');
    for (var i = 0; i < hexString.length; i++) {
        tempN <<= 4;
        tempN |= parseInt(hexString[i], 16);
    }
    return tempN;
};

function __constructorWithOpts(opts) {
    if (!opts.elements && __getType(opts.elements) != "Array") {
        throw new Error("Option elements should not be empty and should be an Array.");
    }

    // Default hash function is set to MurmurHash3.
    // An optional hash function should be hash function with seed.
    if (!opts.hash) {
        opts.hash = __getDefaultHashFunction();
    }

    if (!opts.p) {
        // The false positive probability <= 0.1% in default.
        opts.p = 0.001;
    }

    this.hash = opts.hash;
    this.p = opts.p;
    var n = opts.elements.length;
    this.length = n;
    var bitLength = Math.ceil(-1.0 * n * Math.log(this.p) / Math.pow(Math.log(2), 2)); // which is m
    this.k = Math.ceil(bitLength / n * Math.log(2));

    // zero fill the array
    this.filter = (new Array(Math.ceil(bitLength / SAFE_BITS_LENGTH) + 1)).join('0').split('').map(parseFloat);
    this.bitLength = this.filter.length * 32;

    opts.elements.forEach((function(val) {
        this.__add(val);
    }).bind(this));
}

function __constructorWithInputString(inputString, hashFunc) {
    hashFunc = hashFunc || __getDefaultHashFunction();
    this.hash = hashFunc;
    var intArray = inputString.match(/.{1,8}/g).map(function(val) {
        return __unsignedHexToInt(val);
    });
    var k = intArray[intArray.length - 2];
    var length = intArray[intArray.length - 1];
    var filter = intArray.slice(0, intArray.length - 2);
    var bitLength = filter.length * 32;
    var p = Math.exp(-1.0 * bitLength / length * Math.pow(Math.log(2), 2));
    this.filter = filter;
    this.k = k;
    this.p = p;
    this.length = length;
    this.bitLength = bitLength;
}

function BloomFilter(opts, hashFunc) {
    if (__getType(opts) == 'Object') {
        __constructorWithOpts.call(this, opts);
    } else if (__getType(opts) == 'String') {
        __constructorWithInputString.call(this, opts, hashFunc);
    }
}

BloomFilter.prototype.__add = function(obj) {
    for (var i = 1; i < this.k + 1; i++) {
        var n = bigInt(this.hash(obj, i), 16);
        var slot = n.mod(this.bitLength);
        var index = Math.floor(slot / SAFE_BITS_LENGTH);
        var offset = slot % SAFE_BITS_LENGTH;
        this.filter[index] |= 0x80000000 >>> offset;
    }
}

BloomFilter.prototype.has = function(obj) {
    for (var i = 1; i < this.k + 1; i++) {
        var n = bigInt(this.hash(obj, i), 16);
        var slot = n.mod(this.bitLength);
        var index = Math.floor(slot / SAFE_BITS_LENGTH);
        var offset = slot % SAFE_BITS_LENGTH;
        if ((this.filter[index] & (0x80000000 >>> offset)) == 0) {
            return false;
        }
    }
    return true;
}

BloomFilter.prototype.toString = function() {
    var hex = this.filter.map(function(val) {
        var _n = __intToUnsignedHex(val);
        return "00000000".slice(_n.length) + _n;
    }).join('');
    var _k = __intToUnsignedHex(this.k);
    var _n = __intToUnsignedHex(this.length);
    hex += ("00000000".slice(_k.length) + _k);
    hex += ("00000000".slice(_n.length) + _n);
    return hex;
}

module.exports = BloomFilter;