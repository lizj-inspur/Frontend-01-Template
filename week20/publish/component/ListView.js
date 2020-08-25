import { createElement, Text, Wrapper } from "./createElement";
export class ListView {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(name, value) {
    //attribute
    this[name] = value;
  }
  getAttribute(name) {
    //attribute
    return this[name] ;
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    let data = this.getAttribute("data");
    let elelement =  <div class="list-view" style="width:300px">
    {
        data.map(this.children[0])
    }
    </div>;
    
    return elelement;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
