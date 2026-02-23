
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.level)
    if (!roles.includes(req.user.level)) {
      return res.status(403).json({
        success: false,
        message: `ไม่อนุญาตให้ใช้บทบาท ${req.user.level} `
      })
    }
    next()
  }
}
