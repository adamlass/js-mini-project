const assert = require("assert")
const blogFacade = require("../facade/blogFacade")
const { makeOptions, handleHttpErrors } = require("../utils/FacadeUtils")
const LocationBlog = require("../models/LocationBlog")
const fetch = require("node-fetch")
const User = require("../models/User")

const port = 3002
const url = `http://localhost:${port}/api/blogs/`
const url_users = `http://localhost:${port}/api/users/`

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

            let res = await fetch(url, makeOptions("POST", blog))

            let json = await handleHttpErrors(res)


            assert.equal(json.info, blog.info)
        })

        it("should add a like to the post", async function () {
            let res = await fetch(`${url}like/${testBlog1._id}/${testUser1.userName}`,
                makeOptions("PUT"))

            let blog = await handleHttpErrors(res)
            assert.ok(blog.likedBy[0]._id, testUser1._id)
        })


    })

    describe("UserFacade", function () {
        it("should contain one and specific user", async function () {
            let res = await fetch(url_users)
            let users = await handleHttpErrors(res)

            assert.equal(users.length, 1)
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



})

