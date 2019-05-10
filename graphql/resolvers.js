const userFacade = require("../facade/userFacade")
const loginFacade = require("../facade/loginFacade")
const blogFacade = require("../facade/blogFacade")
const { DateTime } = require("@okgrow/graphql-scalars")


// resolver map
module.exports = {
    DateTime,
    Query: {
        getAllUsers() {
            return userFacade.getAllUsers()
        },
        findUserByUserName(root, { userName }) {
            return userFacade.findByUserName(userName)
        },

    },
    Mutation: {
        login(root, { input }) {
            const { userName, password, latitude, longitude, distance, pushToken } = input
            return loginFacade.login(userName, password, latitude, longitude, distance, pushToken)
        },
        async removeUser(root, { id }) {
            await userFacade.removeUser(id)
            return "Successfully deleted user"
        },
        addUser(root, { input }) {
            const { firstName, lastName, userName, password, email } = input
            return userFacade.addUser(firstName, lastName, userName, password, email)
        },
        async likeLocationBlog(root, { input }) {
            var { blogID, userName } = input
            var blog = await blogFacade.findLocationBlogOnId(blogID)
            var user = await userFacade.findByUserName(userName)
            return blogFacade.likeLocationBlog(blog, user)
        }
    }
}