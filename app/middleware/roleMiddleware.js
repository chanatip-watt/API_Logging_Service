
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `ไม่อนุญาตให้ใช้บทบาท ${req.user.role} `
      })
    }
    next()
  }
}
