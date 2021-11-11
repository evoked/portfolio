import axios from 'axios'
import e from 'express'
import fs from 'fs'

const writeData = async (option, data) => {
    if(typeof option === 'undefined') {
        console.log(option)
        return 
    } else if (typeof option === 'string') {
        writeToFile(option, data)
    } else {
        return new Error('file type incorrect, use `personal`, `history`, `forks`')
    }
}

const writeToFile = async (option, data) => {
    const filePath = `../${option}.json`
    if (option === 'personal') {
        try {
            fs.writeFile(filePath, JSON.stringify(data), err => {
                if(err) return new Error('unable to write data')
            })
            return
        } catch (e) {
            throw e
        }
    } 
    const time = new Date().toLocaleTimeString()
    switch (option) {
        case 'history':
            fs.appendFile(filePath, `${time} ${data} \n`, err => {
                if(err) return error
            })
            return
            /* TODO:
            Create custom logging system that includes days, hour accessed, can be useful
            for showing traffic of all projects once hosting
            */
            
        case 'forks':
            const parsedData = {...data}
            const {name, forks_count} = parsedData[Object.keys(parsedData)[0]]
            console.log(parsedData)
                fs.appendFile(filePath, `${time} | ${name}: ${forks_count} \n`, err => {
                    if(err) return error
                })
            return
    }
    return new Error(`file type incorrect, use 'personal', 'history', forks`)
}

const getData = async (url) => {
    // users/evoked/repos
    console.log(url)
    let x = await axios.get(`https://api.github.com/${url}`, {
        headers: {
            'User-Agent': 'evoked',
            "Accept":"application/vnd.github.mercy-preview+json"
    }}).catch(rej => {
        return new Error('unable to connect to EEEEEE')
    })

    if(!x.data) return new Error('unable to connect to github')

    let data = []

    if(url === 'users/evoked/repos') {
        x.data.forEach(element => {
            console.log(element)
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

            if(!project.images || project.name === 'portfolio') {
                data.push(project); 
                return;
            }

            const images = project.images.split(' ')
            project = {
                ...project, 
                images: images
            }
            data.push(project)
            return
        });
        return data
    }
    x.data.items.forEach(element => {
        data.push(element)
    })
    return data
}

const doesFileExist = async (file) => {
    return fs.existsSync(file)
}

const fileNames = {
    GITHUB: '../data.json',
    HISTORY: '../history.json',
    FORKS: '../forks.json'
}

export default {
    writeData, writeToFile, doesFileExist, getData,
    file: fileNames
}