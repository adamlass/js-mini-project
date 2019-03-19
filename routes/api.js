const express = require("express")
const router = express.Router()

const userRouter = require("./api/users")
const locationRouter = require("./api/locationBlogs")

router.use("/users",userRouter)
router.use("/blogs",locationRouter)

module.exports = router