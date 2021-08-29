
[toc]

# nodejs-testcase-best-practice
nodejs 测试用例最佳实现的服务 

---
# 版本信息
修订日期 | 修订人 | 修订类型 | 修订内容 | 确认人
---|--- |--- |--- |---
2021-08-29 | - | 新需求 | nodejs 测试用例最佳实现 | -
---
# 快速入门
## 一）前言
在软件开发中，测试用例对于保证软件质量起着举足轻重的作用；  
对于 web 后端服务来说  
**就微服务层面划分**，测试至少分为以下两个方面（以下简称，**路由通路测试**与**服务逻辑测试**）：
1. 路由通路测试：web 路由的通路情况测试，每个control(或者router)的每个接口应当从正（path+method正确）反(path或者method)向测试
2. 服务逻辑测试：业务逻辑测试，业务逻辑测试有分为以下几点，每点均需要正反测试：
    1. 参数合法
    2. 业务
  

**就CI/CD 运维层面划分**，测试可以分为下面三个方面：
1. 单元测试
2. 集成测试
3. 系统测试

## 二）准备工作（web服务搭建）
### 1. web 服务路由
1. 入口文件 `index.js`
2. 服务初始化文件 `init/index.js`
3. lib 工具库
    1. 中间件 `lib/middleware.js`
    2. 路由中间件自加载 `lib/routerhelper.js`
4. router 文件 `router/birds.js`
```
    const express = require('express')
    const router = express.Router()
    const BirdsServer = require('../server/birds-server')
    
    // define the home page route
    router.get('/', async function (req, res, next) {
      try {
        const requestParams = Object.assign({}, req.query, req.params)
        const bird = await BirdsServer.getOneBird({ name: requestParams.name })
        res.json({ code: 0, data: bird })
      } catch (error) { 
        next(error)
      }
    })
    
    // define the about route
    router.get('/about', function (req, res) {
      res.send('About birds')
    })
    
    module.exports = router
```
5. 业务层 `server/birds-server.js`
```
const Birds = require('../model/birds')
const validation = require('./validation')

class BirdsServer {
  static async getOneBird (obj) {
    // 参数校验
    const value = await validation.getOneBirdValidation(obj)

    const bird = await Birds.getInstand().findByName(value.name)

    if (!bird) return 'not found'
    return bird
  }
}

module.exports = BirdsServer
```
    
### 2.mongo 数据库model 类
忽略
> 其他细节详情看仓库代码
### 3.接口参数校验
忽略
> 其他细节详情看仓库代码

## 三）测试代码编写
### 1.路由通路测试
`test/birds.express.test.js` 代码如下所示
```
const test = require('ava')
const sinon = require('sinon')
const supertest = require('supertest')
const { init } = require('../init')

const BirdsServer = require('../server/birds-server')

let request
test.before(async () => {
    let app = await init()
    request = supertest(app)
})

test.cb("路由测试,正常路由 1.1 OK", t => {
    const getOneBird = sinon.stub(BirdsServer, 'getOneBird')
    getOneBird.returns({ msg: "ok" })

    request.get("/birds")
        .end((err, res) => {
            t.true(res.status == 200)
            t.deepEqual(res.body.data, { msg: "ok" })
            getOneBird.reset()
            t.end()
        })
})

test.cb("路由测试,异常路由 1.2非法请求方法测试", t => {
    request.delete("/birds")
        .end((err, res) => {
            t.true(res.status == 404)
            t.true(res.text == '{"code":404,"data":"Not Found"}')
            t.deepEqual(res.body.data, "Not Found")
            t.end()
        })
})
```
### 2.服务逻辑测试
1. 编写业务逻辑测试工具 `test/testinit.js`
```
function methodsForEach (methods, returnParams) {
  for (let i = 0; i < methods.length; i++) {
    methods[i].returns(returnParams[i])
  }
}

function methodsReset (methods) {
  for (let i = 0; i < methods.length; i++) {
    methods[i].reset()
  }
}

class TestInit {
  constructor (test) {
    this.test = test
  }

  testCase (f, description, methods, returnParams, data, okMsg) {
    this.test(description, async t => {
      methodsForEach(methods, returnParams)
      try {
        const res = await f(data)
        t.deepEqual(res, okMsg)
      } catch (e) {
        t.deepEqual(e.message, okMsg.err)
      } finally {
        methodsReset(methods)
      }
    })
  }
}

module.exports = TestInit

```
2. `test/birds.test.js` 代码如下所示
```
const test = require('ava')
const sinon = require('sinon')
const { init } = require('../init')

const Birds = require('../model/birds')
const BirdsServer = require('../server/birds-server')

const TestInit = require('./testinit')

const tester = new TestInit(test)

// test before init router/mongo and so on
test.before(async () => await init())

function testOK (f, description, methods, returnParams, data, okMsg) {
  tester.testCase(f, description, methods, returnParams, data, okMsg)
}

const findByName = sinon.stub(Birds.prototype, 'findByName')

const returnresult = {
  name: 'Parrot',
  age: 1.5
}

// 1. 参数是否通过校验
testOK(
  BirdsServer.getOneBird,
  'server/birds-server.js -> [getOneBird] params is not given ',
  [],
  [],
  {},
  { err: '"name" is required' }
)

// 2. 测试未找到指定的鸟
testOK(
  BirdsServer.getOneBird,
  'server/birds-server.js -> [getOneBird] bird is not exist',
  [findByName],
  [undefined],
  { name: 'turtledove' },
  'not found'
)

// 3. 测试根据name获得指定的鸟
testOK(
  BirdsServer.getOneBird,
  'server/birds-server.js -> [getOneBird] get bird findByName is OK',
  [findByName],
  [returnresult],
  { name: 'Parrot' },
  returnresult
)

```
> sinon.stub 方法说明如下：
>   1. 对一个实例方法打桩时，写法 sinon.stub(Birds.prototype, 'findByName')
>   2. 对一个对象方法（static）打桩时，写法 sinon.stub(Birds, 'findByName')

## 四）跑测试用例
1. 全部一次跑
```
ava -s test/*.test.js
```
2. 单个文件跑
```
ava -s test/banner.test.js
```
3. 测试报告
```
nyc ava -s test/*.test.js report --reporter=html
```
## 设计文档
- [单元测试准则](https://github.com/yangyubo/zh-unit-testing-guidelines)
