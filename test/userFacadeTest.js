const assert = require("assert")
const userFacade = require("../facade/userFacade")
const User = require("../models/User")

const connect = require("../dbConnect")
connect(require("../settings").TEST_DB_URI);

var testUser1

describe("UserFacade", function () {
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
                firstName: "Janne",
                lastName: "Tak",
                userName: "janne",
                password: "1234",
                email: "jann@",
            })
        await testUser2.save()
    })

    afterEach(async function () {
        await User.deleteMany({})
    })

    describe("addUser", function () {
        it("should add the user", async function () {
            const user = await userFacade.addUser("Jens", "Test", "jete", "1234", "jete@")
            assert.equal(user.firstName, "Jens")
            assert.equal(user.lastName, "Test")
            assert.equal(user.userName, "jete")
            assert.equal(user.password, "1234")
            assert.equal(user.email, "jete@")

        })
    })

    describe("add job on user", function () {
        it("should have added a job", async function () {
            const job = {
                type: "CEO",
                company: "Woodle",
                companyUrl: "woodle.io"
            }
            await userFacade.addJobToUser(testUser1, job)
            assert.equal(testUser1.job[0].type, job.type)
            assert.equal(testUser1.job[0].company, job.company)
            assert.equal(testUser1.job[0].companyUrl, job.companyUrl)

        })
    })

    describe("get all users", function () {
        it("should get all the 2 users", async function () {
            const allUsers = await userFacade.getAllUsers()

            assert.ok(allUsers[0].equals(testUser1))
            assert.ok(allUsers[1].equals(testUser2))
        })
    })


    describe("find user", function () {
        it("should find user", async function () {
            const user = await userFacade.findByUserName("jenn")
            assert.ok(user.equals(testUser1))
        })
    })



})



