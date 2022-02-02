const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const loginroute = "/blog/login"
const signuproute = "/blog/signup"
const logoutroute = "/blog/logout"
const blogData = require('./data/blog')
let { ObjectId } = require("mongodb")
app.use(express.json());
function verifyBlogId(id) {
    if(!id) throw {status:400,message:'kindly provide id'}
    if(typeof(id) !== 'string') throw {status:400,message:'kindly provide id in string format'}
    id = id.trim();
    objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(id) || !ObjectId.isValid(id))
      throw {status:400, message:"Invalid ObjectID"};
    return id
}
app.use(
    session({
      name: 'My1stLab',
      secret: "Shhh... Koi He",
      saveUninitialized: true,
      resave: false
    //   cookie: { maxAge: 60000 }
    })
  );
  
  app.use('/blog/:blogId/:commentId', async(req,res,next) => {
    try {
      let blogId = verifyBlogId(req.params.blogId)
      if (req.params.commentId === 'comments'){
          if(!req.session.user) {
              return res.status(403).json({error:"User not logged in"})
          }
      }else{
        if(!req.session.user) {
            return res.status(403).json({error:"User not logged in"})
        }
          let commentId = verifyBlogId(req.params.commentId)
          if(!  await blogData.isSameCommentUser(blogId,commentId,req.session.user.username)) {
              throw {message:"No authorization",status:403}
          }
      }
      
    } catch (e) {
        return res.status(e.status).json({error:e.message})
    }
    next()
})
  app.use('/blog/:id', async(req,res,next) => {
      try {
        let reqMethod = req.method
        if( reqMethod === 'PUT' || reqMethod === 'PATCH'){
            if(!req.session.user) {
                return res.status(403).json({error:"User not logged in"})
            }
            if(! await blogData.isSameBlogUser(req.params.id,req.session.user.username)){
                return res.status(403).json({error:"No authorization"})
            }
        }
      } catch (e) {
          return res.status(e.status).json({error:e.message})
      }
      
    next()
  })
  app.use('/blog', (req, res, next) => {
    console.log(req.originalUrl)
    reqMethod = req.method
    //Login,signup,logout
    if(req.originalUrl === loginroute && reqMethod === "POST") {
        if(req.session.user){
            return res.status(400).json({error:"User already logged in"})
        }
    }
    else if (req.originalUrl === signuproute && reqMethod === "POST"){
        if(req.session.user){
            return res.status(400).json({error:"User is logged in"})
        }
    }
    else if(req.originalUrl === logoutroute && reqMethod === "GET"){
        if(!req.session.user){
            return res.status(401).json({error:"User not logged in"})
        }
    }

    // Blog and Comments post
    if(reqMethod === "POST" && !
        (
            req.originalUrl === loginroute || req.originalUrl === signuproute
        )
    ){
        if(!req.session.user) {
            return res.status(403).json({error:"User not logged in"})
        }
    }

    next()
  });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});