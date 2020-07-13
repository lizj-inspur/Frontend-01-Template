function create(Cls, attributes) {
    // console.log(arguments);
    let o = new Cls;
    for (let name in attributes) {
        o[name] = attributes[name];
    }
    return o;
}

class Cls {

}
let component = < Cls id = "a" / > ;

console.log(component);