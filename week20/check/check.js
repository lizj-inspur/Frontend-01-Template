var page = require("webpage").create();

page.open("http://localhost:9000/dist/index.html", function (status) {
  if (status !== "success") {
    console.log("Unable to access network");
  } else {
    var body = page.evaluate(function () {
      var toString = function (pad, element) {
        var childString = "";
        var children = element.childNodes;
        if (children && children.length > 0) {
          for (var i = 0; i < children.length; i++) {
            childString += toString("    " + pad,children[i]);
          }
          childString += "\n";
        }
        var name="";
        if (element.nodeType === Node.TEXT_NODE) {
          name = " #text " + JSON.stringify(element.textContent);
        }
        if (element.nodeType === Node.ELEMENT_NODE) {
          name = element.tagName;
        }
        
        return pad + name + (childString ? "\n" + childString : "");
      };

      return toString("", document.body);
    });
    console.log(body);
  }
  phantom.exit();
});
