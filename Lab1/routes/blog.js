const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb');
const { user } = require('../config/mongoCollections');
const data = require('../data')
const blogData = data.blog

// let paramsString = "name=foo&age=1337"
// let searchParams = new URLSearchParams(paramsString);

// searchParams.has("name") === true; // true
// searchParams.get("age") === "1337"; // true
function validateNumber(num) {
    //take should be between 0 and 100
    if (!num) throw {status:400,message:'Kindly provide number'}
    if(typeof(num) !== 'string') throw{status:400,message:'kindly provide number in string format'}
    num = num.trim()
    if(num.length === 0) throw{message:'Kindly provide number',status:400}
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
      throw {status:400, message:"Invalid ObjectID"};
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
router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.send('Logged out');
  });
  router.get('/:id', async(req,res) => {
    try {
        
        let blogId = req.params.id
        //Error Check
        blogId = verifyBlogId(blogId)
        const blog = await blogData.getBlogById(blogId)
        if (!blog ){
            res.status(404).json({error: 'No Blogs Found for given ID'})
        }else{
            res.json(blog)
        }
    } catch (e) {
        res.status(e.status).json({error:e.message})
    }

})

router.get('/', async (req,res) => {
    try{
        let paramsString = req.query
        console.log(paramsString)
        let searchParams = new URLSearchParams(paramsString);
        // console.log(searchParams.has("take"))
        // console.log(searchParams.has("skip"))
        let takeip = 0
        let skipip = 0
        if (searchParams.has('take')){
            takeip = validateNumber(searchParams.get("take"))
            if(takeip > 100 || takeip <0) throw{status:400,message:'Invalid value of take'}
        }
        if (searchParams.has('skip')){
            skipip = validateNumber(searchParams.get("skip"))
            if(skipip <0) throw{status:400,message:'Invalid value of skip'}
        }
        //Do the error check for take and skip ip
        let ipParams = {
            take : searchParams.has("take") ? takeip.toString() : undefined,
            skip : searchParams.has("skip") ? skipip.toString(): undefined
        }
        const blogs = await blogData.getBlogs(ipParams)
        if (!blogs ){
            res.status(404).json({error: 'No Blogs Found'})
        }else{
            res.json(blogs)
        }
    }
    catch(e){
        res.status(e.status).json({error:e.message})
    }
});

router.post('/', async(req,res) => {
    try {
        //Check user is logged in or not
        if ( ! req.session.user ) throw {message:'User not logged in',status:400}
        const ipBlogDetails = req.body
        if(Object.keys(ipBlogDetails).length !== 2) throw {status:400,message:'Kindly provide all the inputs'}
        for (let j in ipBlogDetails){
            if (! (
                j === 'title' || j === 'body'
            )) throw{
                status:400,
                message: 'Invalid Schema'
            }
        }
        const title = verifyTitle(ipBlogDetails.title)
        const body = verifyBody(ipBlogDetails.body)
        let userThatPosted = {_id: req.session.user._id,username: req.session.user.username}
        const createBlog = await blogData.createBlog(
            title,
            body,
            userThatPosted,
        )
        if (createBlog){
            res.json(createBlog)
        }else{
            res.status(500).json({error:'Unable to create blog'})
        }
        
    } catch (e) {
        res.status(e.status || 500).json({error:e.message})
    }
})

router.put('/:id', async(req,res) => {
    try {
        //Check user is logged in or not
        if ( ! req.session.user ) throw {message:'User not logged in',status:400}
        const ipBlogDetails = req.body
        if(Object.keys(ipBlogDetails).length !== 2) throw {status:400,message:'Kindly provide all the inputs'}
        for (let j in ipBlogDetails){
            if (! (
                j === 'title' || j === 'body'
            )) throw{
                status:400,
                message: 'Invalid Schema'
            }
        }
        const title = verifyTitle(ipBlogDetails.title)
        const ipBody = verifyBody(ipBlogDetails.body)
        const blogId = verifyBlogId(req.params.id)
        let loggedinUser = req.session.user.username
        // let userThatPosted = {_id: req.session.user._id,username: req.session.user.username}
        if(!  blogData.isSameBlogUser(blogId,loggedinUser)){
            return res.status(403).json({error:"No authorization"})
        }
        const updateBlog = await blogData.putBlog(
            title,
            ipBody,
            loggedinUser,
            blogId
        )
        if (updateBlog){
            res.json(updateBlog)
        }else{
            res.status(500).json({error:'Unable to update blog'})
        }
        
    } catch (e) {
        res.status(e.status || 500).json({error:e.message})
    }
})

router.patch('/:id', async(req,res) => {
    try {
        //Check user is logged in or not
        if ( ! req.session.user ) throw {message:'User not logged in',status:400}
        const ipBlogDetails = req.body
        if( !(Object.keys(ipBlogDetails).length >= 1 &&
           Object.keys(ipBlogDetails).length <=2)
        ) throw {status:400,message:'Kindly provide valid inputs'}
        for (let j in ipBlogDetails){
            if (! (
                j === 'title' || j === 'body'
            )) throw{
                status:400,
                message: 'Invalid Schema'
            }
        }
        let title = undefined
        let ipBody = undefined
        if(ipBlogDetails.title){
            title = verifyTitle(ipBlogDetails.title)
        }
        if(ipBlogDetails.body){
            ipBody = verifyBody(ipBlogDetails.body)
        }
        const blogId = verifyBlogId(req.params.id)
        let loggedinUser = req.session.user.username
        reqBlog = await blogData.getBlogById(blogId)
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
                if(reqBlog.body !== ipBody && ipBody){
                    flag = 1
                }
                if (flag === 0) throw {
                    message:'No change', status:400
                }
            
            const updateBlog = await blogData.patchBlog(
                title,
                ipBody,
                loggedinUser,
                blogId
            )
            if (updateBlog){
                res.json(updateBlog)
            }else{
                res.status(500).json({error:'Unable to update blog'})
            }
        }
    } catch (e) {
        res.status(e.status || 500).json({error:e.message})
    }
})
router.post('/:id/comments',async(req,res) => {
    try {
        let id=verifyBlogId( req.params.id)
        let comment = verifyComment(req.body.comment)
        if ( ! req.session.user ) throw {message:'User not logged in',status:400}
        const result = await blogData.createComment(id,comment,req.session.user.username,req.session.user._id)
        if (result){
            res.json({message:'Comment inserted successfully'})
        }
        

    } catch (e) {
        res.status(e.status).json({error:e.message})
    }
})
router.delete('/:blogId/:commentId', async(req,res) => {
    try {
        if ( ! req.session.user ) throw {message:'User not logged in',status:400}
        let blogId = verifyBlogId(req.params.blogId)
        let commentId = verifyBlogId(req.params.commentId)
        if(!  await blogData.isSameCommentUser(blogId,commentId,req.session.user.username)) {
            throw {message:"No authorization",status:403}
        }
        if (await blogData.deleteComment(blogId,commentId,req.session.user.username)){
            res.json({message:"Deleted successfully"})
        }

    } catch (e) {
        res.status(e.status || 500).json({error:e.message})
    }
})
router.post('/signup',async(req,res) => {
    try {
        const ipBody = req.body
        ipBody.name = verifyName(ipBody.name)    
        ipBody.username = verifyUsername(ipBody.username)    
        ipBody.password = verifyPassword(ipBody.password)   
    
        const user1 = await blogData.signup(ipBody)
        if(!user1) throw {message: 'Unable to create new user', status:400}
        res.json(user1)

    } catch (e) {
        res.status(e.status || 500).json({error:e.message})
    }
})
router.post('/login',async(req,res) => {
    try {
        const ipBody = req.body 
        ipBody.username = verifyUsername(ipBody.username)    
        ipBody.password = verifyPassword(ipBody.password)  
        const user1 = await blogData.login(ipBody)
        if(!user1) throw {message: 'Unable to login', status:400}
        req.session.user = {
            username : user1.username,
            _id : user1._id
        }
        // req.session.user.username = user1.username
        // req.session.user._id = user1._id
        res.json(user1)
    } catch (e) {
        res.status(e.status || 500).json({error: e.message})
    }
})

module.exports = router