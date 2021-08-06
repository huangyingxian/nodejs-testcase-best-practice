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
