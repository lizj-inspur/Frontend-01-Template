// 通过下面的方法了解javascript中global对象有哪些

var set = new Set();
var globalProperties = [
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Array",
    "Date",
    "RegExp",
    "Promise",
    "Proxy",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Function",
    "Boolean",
    "String",
    "Number",
    "Symbol",
    "Object",
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "Atomics",
    "JSON",
    "Math",
    "Reflect"
];
var queue = [];
for (let p of globalProperties) {
    queue.push({
        path: [p],
        object: this[p]
    })
}

let current;

while (queue.length) {
    current = queue.shift();
    if (set.has(current.object)) {
        continue;
    }
    console.log("path=" + current.path.join("."))
    set.add(current.object);
    //console.log("current['object']=" + current.object);
    for (let pName of Object.getOwnPropertyNames(current.object)) {
        var property = Object.getOwnPropertyDescriptor(current.object, pName);
        // console.log("property is [" + property + "]");
        if (property.hasOwnProperty("value") && (property.value != null) && (typeof property.value == 'object' || typeof property.value == 'function') && property.value instanceof Object) {
            queue.push({
                path: current.path.concat([pName]),
                object: property.value
            })
        }
        if (property.hasOwnProperty("get") && (typeof property.get == 'function')) {
            queue.push({
                path: current.path.concat([pName]),
                object: property.get
            })
        }
        if (property.hasOwnProperty("set") && (typeof property.set == 'function')) {
            queue.push({
                path: current.path.concat([pName]),
                object: property.set
            })
        }
    }
}