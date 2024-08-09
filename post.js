var axios = require('axios')
var config = require('./config')

// This help with the Let's Encrypt generated SSL certificate 
var sslRootCAs = require('ssl-root-cas')
sslRootCAs.inject().addFile(__dirname + '/cabundle.crt');


module.exports = {
    newEvent: function(data) {
        return postNewEvent(data)
    }
}

function postNewEvent(eventData) {
    return axios.request({
        method: 'post',
        baseURL: config.postingApi.baseURL,
        url : config.postingApi.url,
        headers: {
            'Content-Type': 'application/json',
        },
        rejectUnauthorized: false,
        strictSSL: false,
        data: eventData,
    })
    .catch(err => {
        console.log('error')
        console.log(err)
    })
}
