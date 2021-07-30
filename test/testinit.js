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
