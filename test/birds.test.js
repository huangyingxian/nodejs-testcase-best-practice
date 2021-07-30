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

const findByPrimary = sinon.stub(Birds.prototype, 'findByPrimary')

const returnresult = {
  uuid: '7ef1625b-0010-46e2-ac3a-b4d52ea7a3b4',
  pic: 'https://www.hao123.com/?tn=91280157_s_hao_pg',
  url: 'https://www.hao123.com/?tn=91280157_s_hao_pg',
  gooduuid: '51221818-5a30-4113-8998-a658b9e8c183',
  state: 'on',
  content: '这是我的内容',
  description: '这是我的描述',
  position: 1,
  linktype: 'outer',
  created: '2017-06-27T09:25:31.624Z',
  modified: '2017-06-27T09:25:31.624Z'
}

const rerror = { msg: 'invalid param' }

// 1、测试根据uuid获得轮播图详情,缺失uuid
testOK(
  BirdsServer.findByPrimary,
  'findByPrimary is lack for uuid',
  [],
  [],
  {},
  rerror
)

// 测试根据uuid获得轮播图详情,正常查看轮播图详情
testOK(
  BirdsServer.findByPrimary,
  'findByPrimary is  ok',
  [findByPrimary],
  [returnresult],
  { uuid: '7ef1625b-0010-46e2-ac3a-b4d52ea7a3b4' },
  { bannerDatil: returnresult }
)
