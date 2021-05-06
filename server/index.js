//  {
//     project: WordCloud for top  Twitter Trends
//     Author: Jackson Emmanuel Oburu
//     version: 1.0
//     credits: Usher Godwin, Traversy Media
//     Email: jacksonbullis1@gmail.com
//     Languages and Libraries used: Node.js, Vanila.Js
// }

//import all the required dependencies, modules and frameworks
const http= require('http');
const path= require('path');
const socketIo= require('socket.io');
const express= require('express');
const needle = require('needle');
const PORT= process.env.PORT || 3000;
const config= require('dotenv').config();

//create a server using the http module and crreate a socket to the server
const app= express();
const server= http.createServer(app);
const io= socketIo(server);


//connect to the index.html file
app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../','client','index.html'))
})

// The code below sets the bearer token from your environment variables
const token = process.env.TWITTER_BEARER_TOKEN;

const endpointURL = 'https://api.twitter.com/1.1/trends/place.json';

async function getRequest() {

    // These are the parameters for the API request
    // specify woeID to fetch, and any additional fields that are required
   
    const params = {
        id: 1528488, // Edit woeIDs to look up
        count: 3
    }

    // this is the HTTP header that adds bearer token authentication
    const res = await needle('get', endpointURL, params, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        return res.body;
        
    } else {
        throw new Error('Unsuccessful request');
    }

    
}

//create a client connection
io.on('connection', async(socket)=>{
    console.log('client connected...')

    try {
                // Make request
                const response = await getRequest();
                
                socket.emit('tweet', response)
                // console.dir(response, {
                //     depth: null
                // });
        
            } catch (e) {
                console.log(e);
                process.exit(-1);
            }
            
})

server.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`);
})


