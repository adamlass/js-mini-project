const resolvers = require("./resolvers")
const { makeExecutableSchema } = require("graphql-tools")

const typeDefs = `

    scalar DateTime

    type JobSchema {
        type: String
        company: String
        companyUrl: String
    }

    type User {
        id: ID
        firstName: String
        lastName: String
        userName: String
        email: String
        job: [JobSchema]
        created: DateTime
        lastUpdated: DateTime
    }

    type Friend {
        userName: String
        latitude: Float
        longitude: Float
        pushToken: String
    }

    type Position{
        latitude: Float
        longitude: Float
    }

    type Blog{
        info: String
        img: String
        pos: Position
        author: User
        created: DateTime
        lastUpdated: DateTime
        likedBy: [User]
    }

    input UserInput {
        firstName: String!
        lastName: String!
        userName: String!
        password: String!
        email: String!
    }

    input LoginInput{
        userName: String!
        password: String!
        longitude: Float!
        latitude: Float!
        distance: Int
        pushToken: String

    }

    input LikeInput{
        blogID: ID!
        userName: String!
    }
    

    type Query {
        getAllUsers: [User]
        findUserByUserName(userName: String!): User
    }

    type Mutation {
        login(input: LoginInput): [Friend]
        removeUser(id: ID): String
        addUser(input: UserInput): User
        likeLocationBlog(input: LikeInput): Blog
    }
`
const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = { schema, typeDefs, resolvers }