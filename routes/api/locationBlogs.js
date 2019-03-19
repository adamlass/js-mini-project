const express = require("express")
const router = express.Router()
const userFacade = require("../../facade/userFacade")
const facade = require("../../facade/blogFacade")

router.post("/", async function(req,res,next){
    try {
        let {info, pos, author} = req.body
        author = await userFacade.findByUserName(author)
        res.send(await facade.addLocationBlog(info, pos, author))
    } catch(err){
        res.send(500,"Couldn't post LocationBlog: " + err)
    }
})

router.put("/like/:id/:userName", async function(req,res,next){
    try {
        let {id, userName} = req.params
        // console.log(req.params)
        let blog = await facade.findLocationBlogOnId(id)
        let user = await userFacade.findByUserName(userName)
        // console.log("blog:",blog,"\nuser:", user)
        await facade.likeLocationBlog(blog,user)
        if(blog){
            res.send(blog)
        } else {
            throw Error()
        }
    } catch(err){
        res.send(500,"Like of post failed: " + err)
    }
})

module.exports = router