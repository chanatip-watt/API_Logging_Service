require('dotenv').config()

const app = require('./app/index')   // ต้องมี app/
const connectDB = require('./app/config/db')

const PORT = process.env.PORT || 5000

connectDB()

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
