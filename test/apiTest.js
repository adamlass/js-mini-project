const assert = require("assert")
const blogFacade = require("../facade/blogFacade")
const { makeOptions, handleHttpErrors } = require("../utils/FacadeUtils")
const fetch = require("node-fetch")

const LocationBlog = require("../models/LocationBlog")
const User = require("../models/User")
const Position = require("../models/Position")

const port = 3002
const url = `http://localhost:${port}`
const url_blogs = `${url}/api/blogs/`
const url_users = `${url}/api/users/`
const url_login = `${url}/api/login/`

//connection to TEST_DB_URI
const connect = require("../dbConnect")
connect(require("../settings").TEST_DB_URI);

//making server
var express = require('express');
var apiRouter = require('../routes/api');
var app = express();
app.use(express.json());
app.use('/api', apiRouter);
app.listen(3002)


describe("API test", function () {
    var testUser1
    var testUser2
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

        testUser2 = new User(
            {
                firstName: "Jens",
                lastName: "Jense",
                userName: "jens",
                password: "1234",
                email: "jens@",
            })
        await testUser2.save()

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
        await Position.deleteMany({})
    })

    describe("LocationBlog", function () {

        it("should post a new locationBlog", async function () {
            const blog = {
                info: "Nice blog man!",
                pos: {
                    longitude: 23,
                    latitude: 42
                },
                author: "jenn"
            }

            let res = await fetch(url_blogs, makeOptions("POST", blog))

            let json = await handleHttpErrors(res)


            assert.equal(json.info, blog.info)
        })

        it("should add a like to the post", async function () {
            let res = await fetch(`${url_blogs}like/${testBlog1._id}/${testUser1.userName}`,
                makeOptions("PUT"))

            let blog = await handleHttpErrors(res)
            assert.ok(blog.likedBy[0]._id, testUser1._id)
        })


    })

    describe("UserFacade", function () {
        it("should contain two and one specific user", async function () {
            let res = await fetch(url_users)
            let users = await handleHttpErrors(res)

            assert.equal(users.length, 2)
            assert.equal(users[0]._id, testUser1._id)
        })

        it("should post a user", async function () {
            let user = {
                firstName: "Jenna",
                lastName: "Testa",
                userName: "jena",
                password: "1234a",
                email: "jenn@a",
            }
            let res = await fetch(url_users, makeOptions("POST", user))
            let res_user = await handleHttpErrors(res)

            assert.equal(user.userName, res_user.userName)
        })

        it("should find user", async function () {
            let res = await fetch(url_users + testUser1.userName)
            let user = await handleHttpErrors(res)

            assert.equal(user._id, testUser1._id)
        })

        it("should add job to user", async function () {
            let job = {
                type: "CEO",
                company: "Clever Builds",
                companyUrl: "cb.dk"
            }
            let res = await fetch(`${url_users}add-job/${testUser1.userName}`, makeOptions("PUT", job))
            let res_user = await handleHttpErrors(res)

            assert.equal(job.type, res_user.job[0].type)
        })

    })

    describe("Login", function () {
        beforeEach(async function () {
            const body = {
                userName: "jenn",
                password: "1234",
                latitude: 31,
                longitude: 51,
                distance: 3000000
            }
            await fetch(`${url_login}`, makeOptions("post", body))
        })

        it("should log in the user with status code 200", async function () {
            const body = {
                userName: "jens",
                password: "1234",
                latitude: 32,
                longitude: 53,
                distance: 3000000
            }
            let res = await fetch(`${url_login}`, makeOptions("post", body))
            assert.equal(res.status, 200)
        })

        it("should have one and only one friend nearby", async function () {        
            const body = {
                userName: "jens",
                password: "1234",
                latitude: 32,
                longitude: 53,
                distance: 3000000
            }
            let res = await fetch(`${url_login}`, makeOptions("post", body))
            let content = await res.json()
            assert.equal(content.friends.length, 1)
        })

        it("should not be nearby friend",async function(){
            const body = {
                userName: "jens",
                password: "1234",
                latitude: 32,
                longitude: 53,
                distance: 2
            }
            let res = await fetch(`${url_login}`, makeOptions("post", body))
            let content = await res.json()
            assert.equal(content.friends.length, 0)
        })
    })



})

