/**
 * 对多个动画进行编排，同时控制
 */
export class TimeLine {
  constructor() {
    this.animationArr = [];
    this.requestId = null;
    this.state = "inited";
  }
  /**
   * 每一步调用的事件
   */
  tick() {
   // console.log("tick...........");
    let t = Date.now() - this.startTime;
    // 过滤 没有结束的动画
    let actvieAnimations = this.animationArr.filter(
      (animation) => !animation.finished
    );
    for (let animation of this.animationArr) {
      let {
        object,
        property,
        template,
        start,
        end,
        duration,
        delay,
        addTime,
        timingFunc,
      } = animation;

      let progression = timingFunc((t - delay-addTime) / duration);
      if (t >= duration + delay + addTime) {
        progression = 1;
        animation.finished = true;
      }
      let value = animation.valueFromProgression(progression); //修改为函数不同实现修改不同的属性
      console.log("value is =" + JSON.stringify(value));
      object[property] = template(value);
    }
    if (actvieAnimations.length > 0) {
      this.requestId = requestAnimationFrame(() => this.tick());
    }
  }
  /**
   * 开始
   */
  start() {
    if (this.state !== "inited") {
      return;
    }
    this.state = "playing";
    this.startTime = Date.now();
    this.tick();
  }
  /**
   * 暂停
   */
  pause() {
    if (this.state !== "playing") {
      return;
    }
    this.state = "paused";
    this.pauseTime = Date.now(); //记录上暂停时间
    if (this.requestId != null) {
      cancelAnimationFrame(this.requestId);
    }
  }
  /**
   * 还原
   */
  resume() {
    if (this.state !== "paused") {
      return;
    }
    this.state = "playing";
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  restart() {
    if (this.state == "playing") {
      this.pause();
    }
    this.animationArr = [];
    this.requestId = null;
    this.state = "inited";
    this.startTime = Date.now();
    this.pauseTime = null;

    this.tick();
  }
  add(animation, addTime) {
    animation.finished = false;
    if (this.state == "playing") {
      animation.addTime =
      addTime != void 0 ? addTime : Date.now() - this.startTime;
    } else {
      animation.addTime = addTime != void 0 ? addTime : 0;
    }
    this.animationArr.push(animation);
  }
}
/**
 * let animation = new Animation(object,property,start,end,duration,delay,timingFunc );
 *
 * animation.start();
 * animation.pause();
 * animation.stop();
 * animation.resume();
 *
 * let timeline = new Timeline;
 *
 * timeline.add(animation);
 * timeline.add(animation2);
 * timeline.start();
 * timeline.pause();
 * timeline.stop();
 * timeline.resume();
 *
 * setTimeOut()
 * setInterval();
 * requsetAnimationFrame();
 */
export class Animation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunc
  ) {
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.template = template;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFunc =
      timingFunc ||
      ((start, end) => {
        return (t) => start + (t / duration) * (end - start);
      });
  }

  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}


export class ColorAnimation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunc
  ) {
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.template = template;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFunc =
      timingFunc ||
      ((start, end) => {
        return (t) => start + (t / duration) * (end - start);
      });
  }

  valueFromProgression(progression) {
    return {
      r:this.start.r+progression *(this.end.r-this.start.r),
      g:this.start.g+progression *(this.end.g-this.start.g),
      b:this.start.b+progression *(this.end.b-this.start.b),
      a:this.start.a+progression *(this.end.a-this.start.a),
    };
  }
}