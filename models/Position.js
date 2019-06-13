var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const SECONDS = 1;
var EXPIRES = 60 * 60 * SECONDS;

var PositionSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    created: { type: Date, expires: EXPIRES, default: Date.now },
    loc: {
        'type': { type: String, enum: "Point", default: "Point" },
        coordinates: { type: [Number] }
    },
    pushToken: {type: String, default: null}
})

PositionSchema.index({ loc: "2dsphere" }, { "background": true });

module.exports = mongoose.model("Position", PositionSchema);