/**
 * 模拟实现客户端调用
 */
const net = require("net");
/**
 * request包装类
 *
 * 格式为
 * method ,url
 * body:k/v
 * headers
 */
class Request {
    /**
     * 构造方法
     *
     * @param {} options
     */
    constructor(options) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.body = options.body || {};
        this.path = options.path || "/";
        this.headers = options.headers || {};
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if (this.headers["Content-Type"] == "applicaton/json") {
            this.bodyText = JSON.stringify(this.body);
            //如果是form表单格式将数据转为 name=1&age=14的格式
        } else if (
            this.headers["Content-Type"] == "application/x-www-form-urlencoded"
        ) {
            this.bodyText = Object.keys(this.body)
                .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
                .join("&");
        }
        //设置content-length
        this.headers["Content-Length"] = this.bodyText.length;
    }
    /**
     * 转换为字符串
     */
    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers)
      .map((key) => `${key}: ${this.headers[key]}`)
      .join("\r\n")}\r\n\r\n${this.bodyText}`;
    }
    send(conn) {
        return new Promise((resovle, reject) => {
            const parser = new ResponseParser();
            if (conn) {
                conn.write(this.toString());
            } else {
                conn = net.createConnection({
                        host: this.host,
                        port: this.port,
                    },
                    () => {
                        console.log(
                            "=============================客户端发送的参数============================="
                        );
                        console.log(this.toString());
                        console.log(
                            "=============================客户端发送的参数============================="
                        );
                        conn.write(this.toString());
                    }
                );
            }
            conn.on("data", (data) => {
                console.log(
                    "=============================服务器返回的参数============================="
                );
                // console.log(data.toString());
                //console.log("statusLine=" + parser.statusLine);
                //console.log("body content is " + parser.bodyParser.content.join(""));
                //console.log(parser.header);
                parser.reveive(data.toString()); //解析响应的报文
                if (parser.isFinished) {
                    resovle(parser.response);
                }

                //   resovle(data.toString());
                console.log(
                    "=============================服务器返回的参数============================="
                );
                conn.end();
            });
            conn.on("error", (err) => {
                console.log(
                    "=============================出现异常============================="
                );
                console.log(err);
                reject(err);
                console.log(
                    "=============================出现异常============================="
                );
            });
            conn.on("end", () => {
                console.log("已从服务器断开");
            });
        });
    }
}
/**
 * response包装类
 * 读取响应报文内容并解析
 * 
HTTP/1.1 200 OK
X-Foo: bar
Content-Type: text/plain
Date: Tue, 12 May 2020 11:09:46 GMT
Connection: keep-alive
Transfer-Encoding: chunked
2
ok
0
 */
class ResponseParser {
    constructor() {
        /**
         * 状态码
         */
        this.WAITING_STATUS_LINE = 0;
        //状态行结束
        this.WAITING_STATUS_LINE_END = 1;
        //读取header的
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        //读取header的值
        this.WAITING_HEADER_VALUE = 4;
        //header 一行结束
        this.WAITING_HEADER_LINE_END = 5;
        //header段结束
        this.WAITING_HEADER_BLOCK_END = 6;

        this.WAITING_BODY = 7;
        //设置初始状态
        this.current = this.WAITING_STATUS_LINE;
        // 状态行
        this.statusLine = "";
        //存放header信息
        this.header = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = "";
    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.header,
            body: this.bodyParser.content.join("")
        }
    }
    reveive(responseData) {
        console.log(responseData);
        for (let i = 0; i < responseData.length; i++) {
            this.reveiveChar(responseData.charAt(i));
        }
    }
    reveiveChar(char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === "\r") {
                //表示结束了
                this.current = this.WAITING_STATUS_LINE_END;
            } else if (char === "\n") {
                //切成下一个状态
                console.log("不可能走这。。。。。。。。。。。。。。。");
                this.current = this.WAITING_HEADER_NAME;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ":") {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === "\r") {
                // 如果第一个字符就是\r 切换成读取body
                this.current = this.WAITING_HEADER_BLOCK_END;
                //TODO 增加判断 类型
                if (this.header["Transfer-Encoding"] === "chunked") {
                    this.bodyParser = new TrunkedBodyParser();
                } else {}
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === " ") {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === "\r") {
                this.current = this.WAITING_HEADER_LINE_END;
                this.header[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === "\n") {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            this.bodyParser.reveiveChar(char);
        }
    }
}
/**
 * body解析规则
 */
class TrunkedBodyParser {
    constructor() {
        //等待解析长度
        this.WAIT_LENGTH = 0;
        //长度解析结束
        this.WAIT_LENGTH_LINE_END = 1;
        //读取内容 
        this.WAIT_READING_TRUNK = 2;
        this.WAIT_NEW_LINE = 3;
        this.WAIT_NEW_LINE_END = 4;
        //body解析结束状态
        this.WAIT_BODY_END = 5;
        this.isFinished = false;
        //初始化信息
        //当前body的长度;
        this.length = 0;
        //存放Body信息
        this.content = [];
        this.current = this.WAIT_LENGTH; //设置默认值
    }
    /**
     *
     * @param {*} char
     */
    reveiveChar(char) {
        console.log(JSON.stringify(char));
        // console.log(this.current + "  " + char);
        if (this.current === this.WAIT_LENGTH) {
            if (char === "\r") {
                this.current = this.WAIT_LENGTH_LINE_END;
                //注意长度是16进制 不转换会造成数据读取不完整情况
                this.length = parseInt(this.length, 16);
                if (this.length === 0) {
                    this.isFinished = true;
                    this.current = this.WAIT_BODY_END; //代表解析结束了
                }
                // console.log("lenght=" + this.length);
            } else {
                this.length *= 10;
                //计算length的值
                this.length += char.charCodeAt(0) - '0'.charCodeAt(0);
            }
        } else if (this.current === this.WAIT_LENGTH_LINE_END) {
            if (char === "\n") {
                this.current = this.WAIT_READING_TRUNK;
            }
        } else if (this.current === this.WAIT_READING_TRUNK) {
            //按长度读取内容
            this.content.push(char);
            this.length--;
            if (this.length === 0) {
                this.current = this.WAIT_NEW_LINE;
            }
        } else if (this.current === this.WAIT_NEW_LINE) {
            if (char === "\r") {
                this.current = this.WAIT_NEW_LINE_END;
            }
        } else if (this.current === this.WAIT_NEW_LINE_END) {
            if (char === "\n") {
                this.current = this.WAIT_LENGTH;
            }
        }
    }
}
//初始化入口
void(async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: 8888,
        path: "/",
        headers: {
            "X-Foo2": "customed",
        },
        body: {
            name: "lizj",
        },
    });
    let response = await request.send();
    console.log(response)
})();