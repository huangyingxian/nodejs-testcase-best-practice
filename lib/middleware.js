module.exports = {
  timeLog: (req, res, next) => {
    console.log(`request ${req.path} Time: `, new Date().toLocaleString())
    next()
  },
  errorHandle: (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ code: 500, data: err.message })
  },
  notRouterHandle: (req, res) => {
    res.status(404).json({ code: 404, data: 'Not Found' })
  }
}
