# 每周总结可以写在这里

1、学习 BNF 范式，了解如何使用 Bnf 定义一种语言，并练习写一个四则运算
四则运算
<PrimaryExpression> = <DecimalNumber> |
"(" <LogicalExpression> ")"

<MultiplicativeExpression> = <PrimaryExpression> |
<MultiplicativeExpression> "\*" <PrimaryExpression>|
<MultiplicativeExpression> "/" <PrimaryExpression>

<AdditiveExpression> = <MultiplicativeExpression> |
<AdditiveExpression> "+" <MultiplicativeExpression>|
<AdditiveExpression> "-" <MultiplicativeExpression>

2、学习 JAVASCRIPT 基本数据类型
可查阅 unicode [space 列表](https://www.fileformat.info/info/unicode/category/Zs/list.htm)

WhiteSpace 空白符
<TAB> 水平制表符 \U0009
<VT> 纵向制表符 \U0010
<FF> 荒废
<SP> 普通空格 \0020
<NBSP> NO-BREAK SPACE \U0A0
<ZWNBSP> ZERO WITH NO-BREAK SPACE U+FEXX
<USP>
LineTerminator 换行符
LF: Line Feed `\n`
CR: Carriage Return `\r`

Comment
//  
/\*\*/
Token 记号：一切有效的东西
Punctuator 符号 比如 `> = < }`

IdentifierName
变量名
KeyWords
Identifier
future reserved KeyWords :enum 保留关键字

Literal: 直接量 数据类型
Number
存储 Uint8Array、Float64Array
各种进制的写法
二进制 0b
八进制 0o
十进制 0x
实践
比较浮点是否相等：Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
如何快捷查看一个数字的二进制：(97).toString(2)
String
Character
Code Point
Encoding
unicode 编码 - utf - utf-8 可变长度 （控制位的用处）
Grammar - `''`、`""`、``` `

Boolean
true false
Null
Object
undefined
Symbol
