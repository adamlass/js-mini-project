const LoginFacade = require("../facade/loginFacade")
const connect = require("../dbConnect")


async function test() {
    await connect(require("../settings").DEV_DB_URI)
    const friends = await LoginFacade.login("b", "a", 11, 52, 2300000)
    console.log(friends)
}

test()