const express = require("express")
const router = express.Router()

const userRouter = require("./api/users")
const locationRouter = require("./api/locationBlogs")
const login = require("./api/login")

router.use("/users",userRouter)
router.use("/blogs",locationRouter)
router.use("/login",login)

module.exports = router