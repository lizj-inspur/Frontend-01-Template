# 每周总结可以写在这里

##1、Ecma Global Object ##

- 通过编写代码了解 ECMA 中 JAVASCRIPT 中的 global 对象,并了解以下方法的使用情况

* Object.getOwnPropertyNames
* Object.getOwnPropertyDescriptor
* Object.hasOwnProperty

---

##2、 模拟实现浏览器 ##

- 开始模拟浏览器的实现

* 完成 server.js 和 client.js
* 完成 Request 请求内容发送的自动拼装
* Response 的响应报文的解析
* 了解状态机设计模式相关知识
* 了解请求报文及响应报文格式

  ```
  请求报文样例

  POST / HTTP/1.1
  X-Foo2: customed
  Content-Type: application/x-www-form-urlencoded
  Content-Length: 9

  name=lizj

  响应报文样例

  HTTP/1.1 200 OK
  X-Foo: bar
  Content-Type: text/plain
  Date: Wed, 13 May 2020 08:31:10 GMT
  Connection: keep-alive
  Transfer-Encoding: chunked

  24
  hello xiao huod ban!
  2
  ok
  0

  ```

* 了解分块编码（Transfer-Encoding: chunked）

> Transfer-Encoding，是一个 HTTP 头部字段（响应头域），字面意思是「传输编码」。最新的 HTTP 规范里，只定义了一种编码传输：分块编码(chunked)。
> 分块传输编码（Chunked transfer encoding）是超文本传输协议（HTTP）中的一种数据传输机制，允许 HTTP 由网页服务器发送给客户端的数据可以分成多个部分。分块传输编码只在 HTTP 协议 1.1 版本（HTTP/1.1）中提供。
> 数据分解成一系列数据块，并以一个或多个块发送，这样服务器可以发送数据而不需要预先知道发送内容的总大小。
> 具体方法
> 在头部加入 Transfer-Encoding: chunked 之后，就代表这个报文采用了分块编码。这时，报文中的实体需要改为用一系列分块来传输。
> 每个分块包含**$\color{red}{十六进制}$** 的长度值和数据，长度值独占一行，长度不包括它结尾的 CRLF(\r\n)，也不包括分块数据结尾的 CRLF。
> 最后一个分块长度值必须为 0，对应的分块数据没有内容，表示实体结束。
