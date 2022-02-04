const express = require('express')
const router = express.Router()
const peopledata = require('../data')
const redis = require('redis');
// const client = redis.createClient();

router.get('/history',async(req,res) => {

})

router.get('/:id',async(req,res) => {
    try {
        let id = req.params.id
        if(typeof(id) !== 'string') throw {message:"Invalid Type of ID",status:400}
        id = id.trim()
        if(id.length === 0 ) throw {message:"Invalid Type of ID",status:400}
        
        if(!parseInt(id)) throw {message:"Invalid Type of ID",status:400}

        let response = await peopledata.getById(id)
        if(response){
            res.json(response)
        }
    } catch (e) {
        res.status(e.status || 500).json({error:e.message})
    }
    


})

module.exports = router