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