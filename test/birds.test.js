const sinon = require('sinon')
const test = require('ava')
const { init } = require('../init')

const Birds = require('../model/birds')
const BirdsServer = require('../server/birds-server')

const TestInit = require('./testinit')

const tester = new TestInit(test)

test.before(async () => await init())

function testOK (f, description, methods, returnParams, data, okMsg) {
  tester.testCase(f, description, methods, returnParams, data, okMsg)
}

const findByName = sinon.stub(Birds.prototype, 'findByName')

const returnresult = {
  name: 'Parrot',
  age: 1.5
}

// 1. 测试未找到指定的鸟
testOK(
  BirdsServer.getOneBird,
  'Birds-server -> [getOneBird] findByName is not exist',
  [findByName],
  [undefined],
  {},
  'not found'
)

// 2. 测试根据name获得指定的鸟
testOK(
  BirdsServer.getOneBird,
  'Birds-server -> [getOneBird] findByName is OK',
  [findByName],
  [returnresult],
  {},
  returnresult
)
