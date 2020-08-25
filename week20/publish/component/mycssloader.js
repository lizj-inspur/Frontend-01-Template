let css = require("css");

module.exports = function(source,map) {
 //   console.log(source); //取得源文件
    var stylesheet = css.parse(source);
    //console.log("resourecPath="+this.resourcePath.match(/([^\\]+).css$/));
    let name = this.resourcePath.match(/([^\\]+).css$/)[1];
   // console.log("name="+name);
     for (let rule of stylesheet.stylesheet.rules) {
        //console.log(rule);
        rule.selectors = rule.selectors.map(selector=> {
            //console.log("selector="+selector +" " +selector.startsWith("."+name));
            return selector.startsWith("."+name) ? selector : `.${name} ${selector}`}
            );
        
    }
    return `
    let style = document.createElement("style");
    style.innerHTML = ${JSON.stringify(css.stringify(stylesheet))}
    document.documentElement.appendChild(style);
    `
} 