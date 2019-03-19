const LocationBlog = require("../models/LocationBlog")

class BlogFacade {

    async findLocationBlogOnId(id) {
        return await LocationBlog.findOne({ _id: id })
    }

    async addLocationBlog(info, pos, author) {
        const blog = new LocationBlog({ info, pos, author })
        return await blog.save()
    }

    async likeLocationBlog(blog, user) {
        if (blog.likedBy.length > 0) {
            if (blog.likedBy[0].userName) {
                blog.likedBy = blog.likedBy.map(user => user._id)
            }
        }
        
        if (blog.likedBy.indexOf(user._id) == -1) {
            blog.likedBy.push(user)
            return await blog.save()
        }
    }
}

module.exports = new BlogFacade()