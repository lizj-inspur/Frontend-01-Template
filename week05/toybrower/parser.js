/**
 * 引入 CSS 
 */
const css = require("css");

const layout = require("./layout.js");
/**
 * 结束符号
 */
const EOF = Symbol("EOF");
/**
 * 当前节点
 */
let currentToken = null;
/**
 * 当前属性
 */
let currentAttribute = null;
/**
 * DOM 结点栈
 */
let stack = [{
    type: "document",
    children: [],
}, ];
/**
 * 当前文本节点
 */
let currentTextNode = null;
/**
 * 存储CSS规则
 */
let rules = [];

/**
 * 添加CSS规则
 * @param {*} text 
 */
function addCSSRules(text) {
    var ast = css.parse(text);
    //console.log(JSON.stringify(ast, null, "    "));
    rules.push(...ast.stylesheet.rules);
}
/**
 *  css匹配规则
 * @param {*} element  当前元素
 * @param {*} selector css选择器
 */
function match(element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }
    if (selector.charAt(0) == "#") {
        var attr = element.attributes.filter(attr => attr.name == "id")[0];
        if (attr && attr.value === selector.replace("#", "")) {
            return true;
        }
    } else if (selector.charAt(0) == ".") {
        var attr = element.attributes.filter(attr => attr.name === "class")[0];
        if (attr && attr.value === selector.replace(".", "")) {
            return true;
        }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }

    //return false;
}
/**
 * CSS 规则优化级 采用 4个元素代表每类的级别
 * @param {*} selector 
 */

function specificity(selector) {
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(" ");
    for (var part of selectorParts) {
        if (part.charAt(0) == "#") {
            p[1] += 1;
        } else if (part.charAt(0) == ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }

    return p;
}
/**
 * 比较CSS规则的优先级
 * @param {*} sp1 参数1
 * @param {*} sp2 参数2
 */

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    }
    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
}
/**
 * 收集结点信息的CSS规则
 * @param {*} element 当前节点
 */
function computeCSS(element) {
    // console.log(rules);
    var elements = stack.slice().reverse();
    // console.log("compute CSS for Element", element);
    if (!element.computedStyle) {
        element.computedStyle = {};
    }
    for (let rule of rules) {
        var selectorParts = rule.selectors[0].split(" ").reverse();
        if (!match(element, selectorParts[0])) {
            continue;
        }
        let matched = false;
        var j = 1;
        for (var i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++
            }
        }
        if (j >= selectorParts.length) {
            matched = true;
        }
        if (matched) {
            var sp = specificity(rule.selectors[0]);

            var computedStyle = element.computedStyle;
            for (var declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {}
                }
                computedStyle[declaration.property].value = declaration.value;
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
            }
            //console.log(element.computedStyle);
            // console.log("Element", element, "matched rule", rule);
        }

    }
}
/**
 * 存储当前解析的当前结点信息
 * @param {*} token 
 */
function emit(token) {
    let top = stack[stack.length - 1];
    if (token.type == "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: [],
        };
        element.tagName = token.tagName;
        for (let p in token) {
            if (p != "type" || p != "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p],
                });
            }
        }
        computeCSS(element);
        top.children.push(element);
        //element.parent = top;
        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;
    } else if (token.type == "endTag") {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            //++++++++++++++++遇到style标签时执行添加css规则操作+++++++++++++++++++++++//
            if (top.tagName == "style") {
                addCSSRules(top.children[0].content);
            }
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type == "text") {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: "",
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}
/**
 * 使用有限状态机解析HTML代码 状态机发起点
 * @param {*} c 
 */
function data(c) {
    if (c == "<") {
        return tagOpen;
    } else if (c == EOF) {
        emit({
            type: "EOF",
        });
        return;
    } else {
        emit({
            type: "text",
            content: c,
        });
        return data;
    }
}

function tagOpen(c) {
    if (c == "/") {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: "",
        };
        return tagName(c);
    } else {
        emit({
            type: "text",
            content: c,
        });
        return;
    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c.match(/^[A-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c == ">") {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if (c == "=") {} else {
        currentAttribute = {
            name: "",
            value: "",
        };
        return attributeName(c);
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f] $/) || c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if (c == "=") {
        return beforeAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == '"' || c == "'" || c == "<") {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}



function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
        return beforeAttributeValue;
    } else if (c == '"') {
        return doubleQuotedAttributeValue;
    } else if (c == "'") {
        return singleQuotedAttributeValue;
    } else if (c == ">") {
        return data;
    } else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if (c == '"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c == "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == "\u0000") {

    } else if (c == '"' || c == "'" || c == "<" || c == "=" || c == "`") {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

/**
 * 自结束标签
 * @param {*} c 
 */
function selfClosingStartTag(c) {
    if (c == ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {

    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: "",
        };
        return tagName(c);
    } else if (c == ">") {

    } else if (c == EOF) {

    } else {

    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f] $/)) {
        return afterAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == "=") {
        return beforeAttributeValue;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: "",
        };
        return attributeName(c);
    }
}
/**
 *
 * 解析HTML
 */

module.exports.parseHTML = function parseHTML(html) {
    console.log(html);
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
};

// let source = `<html maaa=a>
// <head>
// <style>
// body div #myid{
// width: 100px;
// backg round-color: #ff5000;
// }
// body div img{
// width: 30px;
// backg round-color: #ff1111;
// }
// </style>
// </head>
// <body>
// <div>
// <img id="myid"/>
// <img/>
// </div>
// </body>
// </html>`;

// let state = data;
// for (let c of source) {
//     state = state(c);
// }

// state(EOF);