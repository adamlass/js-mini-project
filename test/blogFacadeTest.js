const assert = require("assert")
const blogFacade = require("../facade/blogFacade")
const LocationBlog = require("../models/LocationBlog")
const User = require("../models/User")

const connect = require("../dbConnect")
connect(require("../settings").TEST_DB_URI);

describe("LocationBlogFacade", function () {
    var testUser1
    var testBlog1

    beforeEach(async function () {
        testUser1 = new User(
            {
                firstName: "Jenne",
                lastName: "Teste",
                userName: "jenn",
                password: "1234",
                email: "jenn@",
            })
        await testUser1.save()

        testBlog1 = new LocationBlog({
            info: "Very Nice blog i wrote here",
            pos: { longitude: 22, latitude: 23 },
            author: testUser1
        })
        await testBlog1.save()
    })

    afterEach(async function () {
        await User.deleteMany({})
        await LocationBlog.deleteMany({})
    })

    it("should should add the locationblog", async function () {
        const blog = await blogFacade.addLocationBlog("Nice blog i wrote here", { longitude: 24, latitude: 23 }, testUser1)
        assert.equal(blog.author, testUser1)
    })


    it("should add the user to the liked list", async function () {
        const blog = await blogFacade.likeLocationBlog(testBlog1, testUser1)
        assert.ok(blog.likedBy[0].equals(testUser1))
    })

    it("should not be able to have the same user to like twice", async function () {
        const blog = await blogFacade.likeLocationBlog(testBlog1, testUser1)
        await blogFacade.likeLocationBlog(blog, testUser1)
        assert.equal(blog.likedByCount, 1) 
    })
})
