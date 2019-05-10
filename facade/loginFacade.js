const User = require("../models/User")
const Position = require("../models/Position")
const { findNearFriends } = require("../utils/GeoUtils")

class LoginFacade {
    async login(userName, password, longitude, latitude, distance, pushToken) {
        console.log(password)
        const found = await User.findOne({
            userName,
            password
        })

        if (!found) {
            throw Error("Wrong Password or UserName!")
        }

        const query = {
            user: found._id
        }
        console.log("pushtoken:", typeof pushToken)
        const newLoc = {
            loc: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            created: Date.now(),
            pushToken: pushToken

        }

        const options = {
            upsert: true,
            new: true
        }

        let pos = await Position.findOneAndUpdate(query, newLoc, options)

        const nearFriends = await findNearFriends(pos, distance)

        return nearFriends.map(({ user, loc, pushToken }) => {
            return {
                userName: user.userName,
                latitude: loc.coordinates[1],
                longitude: loc.coordinates[0],
                pushToken: pushToken,
            }
        })
    }
}

module.exports = new LoginFacade()