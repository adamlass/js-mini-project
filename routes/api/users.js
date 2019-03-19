const express = require("express")
const router = express.Router()
const facade = require("../../facade/userFacade")

router.get("/", async function (req, res, next) {
    try {
        res.send(await facade.getAllUsers())
    } catch (err) {
        res.send(500, "Couldn't get all users")
    }
})

router.post("/", async function (req, res, next) {
    try {
        let { firstName, lastName, userName, password, email } = req.body
        res.send(await facade.addUser(firstName, lastName, userName, password, email))
    } catch (err) {
        res.send(500,"Saving user failed!")
    }
})

router.get("/:userName", async function (req, res, next) {
    try {
        var userName = req.params.userName
        var user = await facade.findByUserName(userName)
        if(user){
            res.send(user)
        } else {
            throw Error()
        }
    } catch (err) {
        res.send(404, "Couldn't find user on username!")
    }
})


router.put("/add-job/:userName", async function (req,res,next){
    try {
        let userName = req.params.userName
        let user = await facade.findByUserName(userName)
        res.send(await facade.addJobToUser(user,req.body))

    } catch(err){
        res.send(500,"Couldn't add job to user")
    }
})

module.exports = router