module.exports = {
  timeLog: (req, res, next) => {
    console.log(`request ${req.path} Time: `, new Date().toLocaleString())
    next()
  }
}
