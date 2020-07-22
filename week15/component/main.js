import { createElement, Text, Wrapper } from "./createElement";
import {TimeLine,Animation,ColorAnimation} from "./animation";
import {cubicBezier} from "./cubicBezier";
class Carousel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(name, value) {
    //attribute
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    //生成image标签
    let children = this.data.map((url) => {
      let element = <img src={url} />;
      //禁用图片默认拖动事件
      element.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
      return element;
    });

    let position = 0;
    
    let tl = new TimeLine();
    let nextPic = () => {
      tl.restart();
      //debugger;
      let ease = cubicBezier(.25,.1,.25,1);
      let nextPosition = (position + 1) % this.data.length;
      let current = children[position];
      let next = children[nextPosition];
     // current.style.transition = "0s";
      //next.style.transition = "0s";
      let currentP1 = -100 * position;
      let nextP1 = 100 - 100 * nextPosition;
      let currentP2 = -100 - 100 * position;
      let nextP2 = -100 * nextPosition;
      tl.add(new Animation(current.style,"transform",v=>`translateX(${v}%)`,0,currentP1,1000,0,ease));
      tl.add(new Animation(next.style,"transform",v=>`translateX(${v}%)`,0,nextP1,1000,0,ease));
        
      tl.add(new Animation(current.style,"transform",v=>`translateX(${v}%)`,currentP1,currentP2,1000,16,ease));
      tl.add(new Animation(next.style,"transform",v=>`translateX(${v}%)`,nextP1,nextP2,1000,16,ease));
      tl.start();
       position = nextPosition;
     
      setTimeout(nextPic, 3000);
    };
    //定时切换
     setTimeout(nextPic, 3000);  

     let divElement = <div class="carousel">{children}</div>;
     // 增加鼠标事件
    // divElement.addEventListener("mousedown", (event) => {
    //   let startX = event.clientX,
    //     startY = event.clientY;
    //   let nextPosition = (position + 1) % this.data.length;
    //   let lastPosition = (position - 1 + this.data.length) % this.data.length;
    //   let current = children[position];
    //   let next = children[nextPosition];
    //   let last = children[lastPosition];
    //   current.style.transition = "ease 0s";
    //   next.style.transition = "ease 0s";
    //   last.style.transition = "ease 0s";
    //   current.style.transform = `translateX(${-500 * position}px)`;
    //   last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`;
    //   next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;
    //   let move = (event) => {
    //     current.style.transform = `translateX(${
    //       event.clientX - startX - 500 * position
    //     }px)`;
    //     last.style.transform = `translateX(${
    //       event.clientX - startX - 500 - 500 * lastPosition
    //     }px)`;
    //     next.style.transform = `translateX(${
    //       event.clientX - startX + 500 - 500 * nextPosition
    //     }px)`;
    //     // console.log(event.clientX - startX, event.clientX - startY);
    //   };
    //   let up = (event) => {
    //     let offset = 0;
    //     if (event.clientX - startX > 250) {
    //       offset = 1;
    //     } else if (event.clientX - startX < -250) {
    //       offset = -1;
    //     }
    //     current.style.transition = "";
    //     next.style.transition = "";
    //     last.style.transition = "";
    //     current.style.transform = `translateX(${
    //       offset * 500 - 500 * position
    //     }px)`;
    //     last.style.transform = `translateX(${
    //       offset * 500 - 500 - 500 * lastPosition
    //     }px)`;
    //     next.style.transform = `translateX(${
    //       offset * 500 + 500 - 500 * nextPosition
    //     }px)`;
    //     position = (position - offset + this.data.length) % this.data.length;
    //     document.removeEventListener("mousemove", move);
    //     document.removeEventListener("mouseup", up);
    //   };
    //   document.addEventListener("mousemove", move);
    //   document.addEventListener("mouseup", up);
    // });
    return divElement;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}

let component = (
  <Carousel
    data={[
      "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
      "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
      "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
      "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
    ]}
  />
);
component.mountTo(document.body);

console.log(component);
