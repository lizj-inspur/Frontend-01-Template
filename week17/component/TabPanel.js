import { createElement, Text, Wrapper } from "./createElement";
export class TabPanel {
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
    return this[name];
  }
  appendChild(child) {
    this.children.push(child);
  }
  select(i) {
    for (let view of this.childViews) {
      view.style.display = "none";
    }
    this.childViews[i].style.display = "";

    for (let view of this.titleViews) {
      // TODO 需要处理title样式
      view.classList.remove("selected");
    }
    this.titleViews[i].classList.remove("selected");
  }
  render() {
    this.childViews = this.children.map((child) => (
      <div style="width:300px;min-height:300px;border:solid 1px blue;"> {child} </div>
    ));
    this.titleViews = this.children.map((child, index) => (
      <span
        onClick={() => this.select(index)}
        style="background-color:lightgreen;margin:5px 5px 0px 5px;font-size:24px ;width:300px;min-height:300px"
      >
        {child.getAttribute("title")}
      </span>
    ));

    setTimeout(() => {
      this.select(0);
    }, 16);
    return (
      <div class="tab-panel" style="border:soild 1px lightgreen;width:300px">
        <h1 style="widht:300px;margin:0">{this.titleViews}</h1>
        
          {this.childViews}
        
      </div>
    );
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
