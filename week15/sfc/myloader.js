var parser = require("./parser");
module.exports = function (source, map) {
  console.log("-------loader  start-------");
  // console.log(source, this.resourcePath);
  let tree = parser.parseHTML(source);
  //console.log(tree.children[0].children);
  //取template中的内容

  let template = null;
  let script = null;
  for (let node of tree.children) {
    if (node.tagName == "template") {
      template = node.children.filter((e) => e.type != "text")[0];
    }
    if (node.tagName == "script") {
      script = node.children[0].content;
    }
  }

  // console.log(templete);

  let createCode = "";

  let visit = (node) => {
    let attrs = {};
    if (node.type === "text") {
      return JSON.stringify(node.content);
    }
    for (let attribute of node.attributes) {
      attrs[attribute.name] = attribute.value;
    }
    let children = node.children.map((node) => visit(node));
    return `createElement("${node.tagName}",${JSON.stringify(
      attrs
    )},${children}) `;
  };

  // visit(templete);

  console.log("-------loader  end -------");
  let r = `
 import { createElement, Text, Wrapper } from "./createElement";
 export class Carousel {
        render() {
            return ${visit(template)};
        }
        setAttribute(name,value) {
            this[name] = value;
        }
        mountTo(parent) {
            this.render().mountTo(parent);
        }
    }
    `;
  console.log("r");
  return r;
};
