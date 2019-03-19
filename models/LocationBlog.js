var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LocationBlogSchema = new Schema({
    info: {type: String, required: true},
    img: String,
    pos: {
        longitude: {type: Number, required: true},
        latitude: {type: Number, required: true},
    },
    author: {type: Schema.Types.ObjectId, ref:"User", required: true},
    created: {type: Date, default: Date.now},
    lastUpdated: Date,

    //TODO Why not ref below?
    likedBy: [{type: Schema.Types.ObjectId, ref:"User"}],

    //slug: ,

})

LocationBlogSchema.virtual("likedByCount").get(function(){
    return this.likedBy.length
})


LocationBlogSchema.pre("update", function(next){
    this.update({},{$set: {lastUpdated: new Date()}})
    next()
})

var LocationBlog = mongoose.model("LocationBlog", LocationBlogSchema)

module.exports = LocationBlog
