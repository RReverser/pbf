var BufferShim = require('../buffer'),
    test = require('tape');

function toArray(buf) {
    var arr = [];
    for (var i = 0; i < buf.length; i++) {
        arr.push(buf[i]);
    }
    return arr;
}

test('writeUInt32LE', function (t) {
    var shim = new BufferShim(8);
    shim.writeUInt32LE(12562, 0);
    shim.writeUInt32LE(555, 4);

    t.same(toArray(shim.arr), [18,49,0,0,43,2,0,0]);
    t.end();
});

test('readUInt32LE', function (t) {
    var shim = new BufferShim(8);
    shim.writeUInt32LE(12562, 0);
    shim.writeUInt32LE(555, 4);

    t.same([shim.readUInt32LE(0), shim.readUInt32LE(4)], [12562, 555]);
    t.end();
});

test('writeFloatLE', function (t) {
    var shim = new BufferShim(4);
    shim.writeFloatLE(123.456, 0);

    t.same(toArray(shim.arr), [121,233,246,66]);
    t.end();
});

test('readFloatLE', function (t) {
    var shim = new BufferShim(4);
    shim.writeFloatLE(123.456, 0);

    t.ok(Math.round(shim.readFloatLE(0) * 1000) / 1000, 123.456);
    t.end();
});

test('writeDoubleLE', function (t) {
    var shim = new BufferShim(8);
    shim.writeDoubleLE(123.4567890123456789, 0);

    t.same(toArray(shim.arr), [153,76,251,7,60,221,94,64]);
    t.end();
});

test('readDoubleLE', function (t) {
    var shim = new BufferShim(8);
    shim.writeDoubleLE(123.4567890123456789, 0);

    t.ok(Math.round(shim.readDoubleLE(0) * 1e16) / 1e16, 123.4567890123456789);
    t.end();
});

var testStr = 'Привет 李小龙',
    testBytes = [208,159,209,128,208,184,208,178,208,181,209,130,32,230,157,142,229,176,143,233,190,153];

test('write', function (t) {
    var shim = new BufferShim(22);
    shim.write(testStr, 0);

    t.same(toArray(shim.arr), testBytes);
    t.end();
});

test('toString', function (t) {
    var shim = new BufferShim(22);
    shim.write(testStr, 0);

    t.same(shim.toString(), testStr);
    t.end();
});

test('wrap', function (t) {
    var arr = new Uint8Array(testBytes);
    var shim = BufferShim.wrap(arr);

    t.same(shim.toString(), testStr);
    t.end();
});

test('byteLength', function (t) {
    t.same(BufferShim.byteLength(testStr), 22);
    t.end();
});

test('copy', function (t) {
    var shim = BufferShim.wrap(new Uint8Array(testBytes));
    var shim2 = new BufferShim(22);

    shim.copy(shim2);

    t.same(toArray(shim.arr), toArray(shim2.arr));
    t.end();
});