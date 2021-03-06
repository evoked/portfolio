import userSystem from 'os'
import express from 'express'
import fs from 'fs'
import cors from 'cors'
import axios from 'axios'
import cron from 'node-cron'
import dotenv from 'dotenv'
import cf from './util/customFile.js'

dotenv.config()

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors()) 

let PORT = process.env.PORT || 4002

const server = app.listen(PORT, () => {
    let system = {
        info: userSystem.userInfo(), 
        uptime: userSystem.uptime(), 
        host: userSystem.hostname()
    }
    console.log(`Server successfully running on http://localhost:${PORT}`);
    console.log(`Server details: `)
    console.log(system)
    }
) 

server.on('error', async err => {
    if(err.EADDRINUSE) {
        console.log('port already in use')
        server.close(err => console.log(`server closed: ${err}`))
    }
})

app.get('/api/default', (req,res) => {
    const ip = req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        null;
    if(ip === '::1') {
        console.log(ip)
        cf.writeToFile('history', ip)
    }
    req.send(ip)
})


app.get('/api/details', async (req,res) => {
    let x = await cf.doesFileExist(cf.file.GITHUB)
    if(!x) {
        console.log('data file created')
        await cf.writeData('github')
    }

    let buffer = fs.readFileSync(cf.file.GITHUB)
    let response = JSON.parse(buffer)
    res.json(response)
})

const links = [
    { link: 'search/repositories?q=user%3Apavelpichrt+repo%3Atest-js-grad+test-js-grad', fileToWrite: 'forks' },
    { link: 'users/evoked/repos', fileToWrite: 'personal'}
]

cron.schedule('*/1 * * * *', async () => {
    try{
        console.log('')
        links.forEach(async (link) => {
            let data = await cf.getData(link.link)
            cf.writeData(link.fileToWrite, data)
        })
    } catch (e) {
        console.log(e)
    }
})
// todo change to 10 minutes



app.get('/api/spotify', async (req,res) => {
    let token = await axios.post('https://accounts.spotify.com/api/token', {
            headers: {"Authorization": `Basic ${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`},
            data: {"grant_type": "client_credentials"}
        })
        console.log(token)
    await getCurrentPlaying("BQBUCtVxxgThDpjO6Mnu2OkY5cLo-lc0mLDB7dkw74jZ_Eo6RZjKkk5rIRS4W9ohaFL-IoPKdUb1ZL8VBSI")
    .then(response => {
        console.log(response)
        res.send(response)
    })
})


const refreshToken = async () => {
    console.log(process.env.CLIENT_ID)
    console.log(ids)
    return ids
}

const getCurrentPlaying = async (token) => {
    let n  = {}
    await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
    }})
    .then((res) => {
        if(!res.data) return 'not playing'
        console.log(res.data)
        n = res.data
    }).catch(e => {
        throw new Error('unable to connect to spotify API')
    })
    console.log(n, "hahaha")
    return n
}
