const bcrypt = require('bcrypt');
const saltRounds = 16;
const mongoCollections = require('../config/mongoCollections')
const blog = mongoCollections.blog
let { ObjectId } = require("mongodb")
const { user } = require('../config/mongoCollections')

function validateNumber(num) {
    //take should be between 0 and 100
    if (!num) throw {status:400,message:'Kindly provide number'}
    if(typeof(num) !== 'string') throw{status:400,message:'kindly provide number in string format'}
    num = num.trim()
    if(num.length === 0) throw{message:'Kindly provide number',status:400}
    // let NumberRegex = /^\d{2,3}$/  // Google: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
    // if(!NumberRegex.test(num)) throw [400,'Kindly enter phone number in xxx-xxx-xxxx format']
    num = parseInt(num,10)
    if( isNaN(num)) throw {message:'Null number',status:400}
    return num
}
function verifyTitle(title) {
    if (!title) throw {status:400,message:'Kindly provide title'}
    if(typeof(title) !== 'string') throw {status:400,message:'kindly provide title in string format'}
    title = title.trim()
    if(title.length === 0) throw {status:400, message:'Blank Title'}
    return title
}
function verifyBody(body) {
    if (!body) throw {status:400,message:'Kindly provide body'}
    if(typeof(body) !== 'string') throw {status:400,message:'kindly provide body in string format'}
    body = body.trim()
    if(body.length === 0) throw {status:400, message:'Blank body'}
    return body
}
function verifyComment(comment) {
    if (!comment) throw {status:400,message:'Kindly provide comment'}
    if(typeof(comment) !== 'string') throw {status:400,message:'kindly provide comment in string format'}
    comment = comment.trim()
    if(comment.length === 0) throw {status:400, message:'Blank comment'}
    return comment
}
function verifyBlogId(id) {
    if(!id) throw {status:400,message:'kindly provide id'}
    if(typeof(id) !== 'string') throw {status:400,message:'kindly provide id in string format'}
    id = id.trim();
    objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(id) || !ObjectId.isValid(id))
      throw {status:400, message:"Invalid ObjectID."};
    return id
}
function verifyUsername(user1) {
    if (!user1) throw {status:400,message:'Kindly provide username'}
    if(typeof(user1) !== 'string') throw {status:400,message:'kindly provide username in string format'}
    user1 = user1.trim()
    if(user1.length === 0) throw {status:400, message:'Blank username'}
    spaceRegex = /\s/g
    let spregex = /[^\w]/g
    if(spaceRegex.test(user1)) throw {message:"Username can not contain space",status:400}
    if(spregex.test(user1)) throw {message:"Username can not contain special symbols",status:400}
    return user1
}
function verifyUserId(id) {
    if(!id) throw {status:400,message:'kindly provide id'}
    if(typeof(id) !== 'string') throw {status:400,message:'kindly provide id in string format'}
    id = id.trim();
    if (!ObjectId.isValid(id))
      throw {status:400, message:"Invalid ObjectID"};
    return id
}
function verifyName(user1) {
    if (!user1) throw {status:400,message:'Kindly provide user name'}
    if(typeof(user1) !== 'string') throw {status:400,message:'kindly provide user name in string format'}
    user1 = user1.trim()
    if(user1.length === 0) throw {status:400, message:'Blank user name'}
    let nameRegex = /[^a-zA-Z ]/
    if( nameRegex.test(user1)) throw {message:"User name is invalid",status:400}
    // let spregex = /[^\w]/g
    // if(spregex.test(user1)) throw {message:"User name can not contain special symbols",status:400}
    // let numRegex = /\d/g
    // if(numRegex.test(user1)) throw {message:"User name can not contain numbers",status:400}
    return user1
}
function verifyPassword(pwd) {
    if (!pwd) throw {status:400,message:'Kindly provide password'}
    if(typeof(pwd) !== 'string') throw {status:400,message:'kindly provide password in string format'}
    pwd = pwd.trim()
    if(pwd.length === 0) throw {status:400, message:'Blank password'}
    let spregex = /[^\w]/g
    if(spregex.test(pwd)) throw {message:"Password can not contain special symbols",status:400}
    
    return pwd
}
module.exports = {
    async getBlogs(ipParams){
        let take = 0 
        let skip = 0
        if(ipParams.take){
            take = validateNumber(ipParams.take)
            if( take <0 || take >100) throw {message:'Invalid input for take',status:400}
        }
        if(ipParams.skip){
            // skip = validateNumber(ipParams.get("skip"))
            skip = validateNumber(ipParams.skip)
            if(skip < 0) throw {message:'Invalid input for skip',status:400}
        }   
        const blogCollection = await blog()
        let blogList = await blogCollection.find({})
                                            .limit(take >0 ? take : 20 )
                                            .skip(skip)
                                            .toArray()
        if (blogList.length == 0) throw {message:'No results to display',status:404}
        for (let info of blogList){
            info["_id"] = info["_id"].toString();
            info["userThatPosted"]["_id"]  = info["userThatPosted"]["_id"].toString()
            for (let j of info["comments"]) {
                j["_id"] = j["_id"].toString();
                j["userThatPostedComment"]["_id"] = j["userThatPostedComment"]["_id"].toString();
            }
        }
        return blogList
    },
    async getBlogById(blogId){
        blogId = verifyBlogId(blogId)
        objBlogId = ObjectId(blogId)
        const blogCollection = await blog()
        let info = await blogCollection.findOne({_id:objBlogId})
        if(info === null) throw{message:'No blog found with supplied ID',
                                status:404}
        info["_id"] = info["_id"].toString();
        info["userThatPosted"]["_id"]  = info["userThatPosted"]["_id"].toString()
        for (let j of info["comments"]) {
            j["_id"] = j["_id"].toString();
            j["userThatPostedComment"]["_id"] = j["userThatPostedComment"]["_id"].toString();
        }
        return info
    },
    async getCommentById(blogId){
        blogId = verifyBlogId(blogId)
        objBlogId = ObjectId(blogId)
        const blogCollection = await blog()
        let info = await blogCollection.findOne({_id:objBlogId})
        if(info === null) throw{message:'No blog found with supplied ID',
                                status:404}
        info["_id"] = info["_id"].toString();
        info["userThatPosted"]["_id"]  = info["userThatPosted"]["_id"].toString()
        for (let j of info["comments"]) {
            j["_id"] = j["_id"].toString();
            j["userThatPostedComment"]["_id"] = j["userThatPostedComment"]["_id"].toString();
        }
        return info
    },
    async createBlog(title,body,userThatPosted){
        title = verifyTitle(title)
        body = verifyBody(body)
        userThatPosted._id = ObjectId(verifyUserId(userThatPosted._id))
        userThatPosted.username = verifyUsername(userThatPosted.username)

        let newBlog = {
            title,
            body,
            userThatPosted,
            comments: []
        }
        const blogCollection = await blog()
        let insertInfo = await blogCollection.insertOne(newBlog)
        if(insertInfo.insertedCount === 0 ) 
        throw { message:'Unable to create blog',
                status:500}
        const newId = insertInfo.insertedId
        return await this.getBlogById(newId.toString())
    },
    async putBlog(title,body,loggedinUser,blogId){
        title = verifyTitle(title)
        body = verifyBody(body)
        loggedinUser = verifyUsername(loggedinUser)
        blogId = verifyBlogId(blogId)
        parsedId = ObjectId(blogId)
        reqBlog = await this.getBlogById(blogId)
        if(reqBlog){
            if(reqBlog.userThatPosted.username !== loggedinUser) 
                throw {
                    message: "You don't have access to modify this Blog",
                    status: 403
                }
            if(reqBlog.title === title 
                && reqBlog.body === body) throw {
                    message:'No change', status:400
                }
            let tobeUpdatedBlog = {
                title,
                body,
                userThatPosted :reqBlog.userThatPosted,
                comments: reqBlog.comments
            }
            const blogCollection = await blog()
            let updatedData = await blogCollection.updateOne(
                {_id:parsedId},
                {$set: tobeUpdatedBlog}
            )
            if(updatedData.modifiedCount === 0) 
            throw {
                message:"Unable to update the blog",
                status: 500
            }
            return await this.getBlogById(blogId)
        }else{
            throw {message:"No Blog found for supplied ID",status:404}
        }
    },
    async patchBlog(title,body,loggedinUser,blogId){
        if ((! title) && (! body)) throw {Message: "Kindly provide atleast a title or body",status:400}
        // title = verifyTitle(title)
        if(title){
            if(typeof(title) !== 'string') throw {status:400,message:'kindly provide title in string format'}
            title = title.trim()
            if(title.length === 0) throw {status:400, message:'Blank Title'}
        }
        
        // body = verifyBody(body)
        if(body){
            if(typeof(body) !== 'string') throw {status:400,message:'kindly provide body in string format'}
            body = body.trim()
            if(body.length === 0) throw {status:400, message:'Blank body'}
        }

        loggedinUser = verifyUsername(loggedinUser)
        blogId = verifyBlogId(blogId)
        parsedId = ObjectId(blogId)
        reqBlog = await this.getBlogById(blogId)
        if(reqBlog){
            if(reqBlog.userThatPosted.username !== loggedinUser) 
                throw {
                    message: "You don't have access to modify this Blog",
                    status: 403
                }
                let flag = 0
                if(reqBlog.title !== title && title){
                    flag = 1
                }
                if(reqBlog.body !== body && body){
                    flag = 1
                }
                if (flag === 0) throw {
                    message:'No change', status:400
                }
            let tobeUpdatedBlog = {
                title: (title)?title : reqBlog.title,
                body: (body)?body:reqBlog.body,
                userThatPosted :reqBlog.userThatPosted,
                comments: reqBlog.comments
            }
            const blogCollection = await blog()
            let updatedData = await blogCollection.updateOne(
                {_id:parsedId},
                {$set: tobeUpdatedBlog}
            )
            if(updatedData.modifiedCount === 0) 
            throw {
                message:"Unable to update the blog",
                status: 500
            }
            return await this.getBlogById(blogId)
        }else{
            throw {message:"No Blog found for supplied ID",status:404}
        }
    },
    async signup(input){
        input.name = verifyName(input.name)
        input.username = verifyUsername(input.username)
        input.password = verifyPassword(input.password)

        const userCollection = await user()
        const user1 = await userCollection.findOne({
            username:input.username
        })
        if (user1) throw {
            message: 'Username already exists',
            status:400
        }
        const hash = await bcrypt.hash(input.password,saltRounds)
        let newUser = {
            name:input.name,
            username:input.username,
            password:hash
        }
        let insertInfo = await userCollection.insertOne(newUser)
        if (insertInfo.insertedCount === 0) throw{
            message: 'Unable to create new user',
            status:500
        }
        const nUser = await userCollection.findOne({
            username:input.username
        })

        return {
            name: nUser.name,
            username: nUser.username
        }
    },
    async login(input){
        input.username = verifyUsername(input.username)
        input.password = verifyPassword(input.password)

        const userCollection = await user()
        const user1 = await userCollection.findOne({
            username:input.username
        })
        if (!user1) throw {
            message: "Username doesn't exists",
            status:401
        }
        const check = await bcrypt.compare(input.password,user1.password)
        if(!check) throw {
            message: 'Invalid credentials',
            status: 401
        }

        return {
            _id: user1._id.toString(),
            username: user1.username,
            name: user1.name
        }
    },
    async isSameBlogUser(id,username){
        reqBlog = await this.getBlogById(id)
        if (reqBlog.userThatPosted.username === username){
            return true
        }else{
            return false
        }
    },
    async isSameCommentUser(blogId,commentId,username){

        blogId = verifyBlogId(blogId)
        commentId = verifyBlogId(commentId)
        username = verifyUsername(username)

        const blogCollection = await blog()
        const reqBlog = await blogCollection.findOne(
            // {_id:ObjectId(blogId), "comments._id": ObjectId(commentId) }
            {"comments._id": ObjectId(commentId) },
            {projection: {_id:1,"comments.$":1}}
            )
        if(!reqBlog) throw{status:404,message:'Comment not found'}
        if (reqBlog.comments[0].userThatPostedComment.username === username){
            return true
        }else{
            return false
        }
    },
    async createComment(id,comment,username,userId){
        id = verifyBlogId(id)
        comment = verifyComment(comment)
        username = verifyUsername(username)
        userId = ObjectId(verifyUserId(userId))
        let userThatPostedComment = {
            _id: userId,
            username: username
        }
        //if(! await this.isSameBlogUser(username)) throw {message:'No authorization',status:403}
        let newComment = {
            _id:ObjectId(),
            userThatPostedComment :userThatPostedComment,
            comment:comment
        }
        const blogCollection = await blog()
        const updatedBlog = await blogCollection.updateOne(
            {_id:ObjectId(id)},
            {$addToSet: {comments: newComment}}
            // {$push: {comments: newComment}}
            )
            // const updateInfo = await userCollection.updateOne(
            //     { _id: userId },
            //     { $addToSet: { posts: { id: postId, title: postTitle } } }
            //   );
        if(updatedBlog.insertedCount === 0) throw {message:'Unable to add comment',status:500}
        return true
    },
    async deleteComment(blogId,commentId,username){
        blogId = verifyBlogId(blogId)
        commentId = verifyBlogId(commentId)
        username = verifyUsername(username)
        if(! await this.isSameCommentUser(blogId,commentId,username)) throw{
            message:"No Authorization",
            status:403
        }
        const blogCollection = await blog()
        const delComment = await blogCollection.updateOne(
            {_id:ObjectId(blogId), "comments._id": ObjectId(commentId) },
            {$pull:{
                comments: {
                    _id:ObjectId(commentId)
                }
            }}
            // {$PULL:{"comments._id": ObjectId(commentId)}}
            )
        if(delComment.modifiedCount === 0) throw {
            message:'Unable to delete the comment',
            status : 400
        }
        return true

    }



}