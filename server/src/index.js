import express from 'express'
import cors from 'cors'
import axios from 'axios'
import cron from 'node-cron'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 4002
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
)
  
app.get('/api/details', async (req,res) => {
    let x = await doesFileExist()
    if(!x) {
        console.log('data file created')
        await writeData()
    }

    let buffer = fs.readFileSync('../data.json')
    let response = JSON.parse(buffer)
    res.json(response)
})

// app.get('/api/spotify', async (req,res) => {
//     let n = await getCurrentPlaying()
//     .then(response => {
//         axios.post('https://accounts.spotify.com/api/token', {
//             "grant_type": "authorization_code",
//             "code": "",
//         })
//         console.log(process.env.CLIENT_ID)
//         res.send({response})
//     })
// })

cron.schedule('*/1 * * * *', () => {
    try{
        writeData()
        console.log(`new data grabbed`)
    } catch (e) {
        console.log(e.message)
    }
})

const writeData = async () => {
    let data = await githubData()
    fs.writeFile('../data.json', JSON.stringify(data), (err) => {
        if(err) return new Error('unable to write new data')
    })
}

const doesFileExist = async () => {
    return fs.existsSync('../data.json')
}

const githubData = async () => {
    let x = await axios.get('https://api.github.com/users/evoked/repos', {
        headers: {
        'User-Agent': 'evoked-portolio',
        "Accept":"application/vnd.github.mercy-preview+json"
    }}).catch(rej => {
        throw new Error('unable to connect to github')
    })

    let data = []

    x.data.forEach(element => {
        let project = {
            userDetails: {
                username: element.owner.login, 
                usernameUrl: element.owner.html_url,
            },
            name: element.name,
            url: element.html_url,
            description: element.description,
            topics: element.topics,
            images: element.homepage,
            updatedAt: element.updated_at
        }

        if(!project.images) {
            data.push(project); 
            return;
        }

        const images = project.images.split(' ')
        project = {
            ...project, 
            images: images
        }
        data.push(project)
    });

    data.push({timeUpdated: new Date()})
    return data
}

const refreshToken = async () => {
    console.log(process.env.CLIENT_ID)
    console.log(ids)
    return ids
}

const getCurrentPlaying = async () => {
    let n  = {}
    await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
            "Authorization": "Bearer BQBSF1WTIdpHhRuerUn67eMtCR5NIio8pOFWqmyzbmuDiO9_05iqj2RQFhBywAe1LC_XkO0dCSbXbXehWx-SB0As4pw13bZXqzSsa7V0HHskJKBK-rOFtDJuxCHi6f5APzh2KAsfspwj44pJT5I6AQ",
            "Accept": "application/json",
            "Content-Type": "application/json"
    }})
    .then((res) => {
        if(!res.data) return 'not playing'
        n = res.data
    }).catch(e => {
        throw new Error('unable to connect to spotify API')
    })
    console.log(n)
    return n
}
