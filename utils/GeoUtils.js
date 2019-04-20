const Position = require("../models/Position")

class GeoUtils {
    async findNearFriends(pos, distance) {
        return Position.find(
            {
                user: {$ne: pos.user},
                loc: {
                    $near: {
                        $geometry: pos.loc,
                        $maxDistance: distance
                    }
                }
            }
        ).populate("user")
    }
}

module.exports = new GeoUtils()