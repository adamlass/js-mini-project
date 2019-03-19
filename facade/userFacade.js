const User = require("../models/User")

class UserFacade {
    async addUser(firstName, lastName, userName, password, email) {
        let user = new User({ firstName, lastName, userName, password, email })
        return user.save()
    }

    async addJobToUser(user, job) {
        user.job.push(job)
        return user.save()
    }

    async getAllUsers() {
        return await User.find({})
    }

    async findByUserName(username) {
        return (await User.find({userName: username}))[0]
    }

}

module.exports = new UserFacade()