import axios from 'axios'
const url = "https://api.unsplash.com/photos/?client_id=hweTc-q9oHzdWWUlW4UdBpTR0szLI9_oE4KssQkkFxY"
async function getImages() {
    let data = await axios.get(url)
    if (data.length !== 0){
        console.log(data)
    }
}

module.exports = getImages