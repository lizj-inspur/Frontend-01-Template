const EOF = Symbol("EOF");

function data(c) {
    if (c == "<") {
        return tagOpen;
    } else if (c == EOF) {
        return;
    } else {
        return data;
    }
}

function tagOpen(c) {
    if (c == "/") {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/g)) {
        return tagName(c);
    } else {
        return;
    }
}

function endTagOpen() {

}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == 1) {

    } else {

    }
}

function beforeAttributeName() {

}

/**
 * 解析html内容
 * 使用有限状态机
 */
module.exports.parseHTML = function parseHTML(html) {
    let state = data;
    for (let c of html) {
        state()
    }

}