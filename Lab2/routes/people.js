const express = require('express')
const router = express.Router()
const peopledata = require('../data')
const redis = require('redis');
const client = redis.createClient();

(async () =>{
    await client.connect();
})();

router.get('/history',async(req,res) => {
    // zrange myset1 0 -1 rev
    try {
        let historyOfPeople = await client.zRange("History",0,20,"REV")
        if(! historyOfPeople) throw {status:404,message:"No history"}
        for (let i = 0; i < historyOfPeople.length; i++) {
            historyOfPeople[i] = JSON.parse(historyOfPeople[i])
          }

        res.json(historyOfPeople)
    } catch (e) {
        res.status(e.status || 500).json({error:e.message})
    }
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