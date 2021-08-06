import axios from 'axios'
import fs from 'fs'

const writeData = async (option, data) => {
    if(typeof option === 'undefined') {
        console.log(option)
        return 
    } else if (typeof option === 'string') {
        writeToFile(option, data)
    } else {
        return new Error('file type incorrect, use `github` or `history`')
    }
}

const writeToFile = async (option, data) => {
    const error = new Error('unable to write new data')
    if (option === 'github') {
        try {
            fs.writeFile('../data.json', JSON.stringify(data), err => {
                if(err) return error
            })
            return
        } catch (e) {
            throw e
        }
    } else if (option === 'history') {
        try {
            // todo
            fs.appendFile('../history.json', `${data} \n`, err => {
                if(err) return error
            })
            console.log(data + 'has been written')
            return
        } catch (e) {
            throw e
        }
    }
    return new Error('file type incorrect, use `github` or `history`')
}

const githubData = async () => {
    let x = await axios.get('https://api.github.com/users/evoked/repos', {
        headers: {
        'User-Agent': 'evoked',
        "Accept":"application/vnd.github.mercy-preview+json"
    }}).catch(rej => {
        return new Error('unable to connect to github')
    })

    if(!x.data) return new Error('unable to connect to github')

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

        if(project.name === "portfolio") {
            return;
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

    return data
}

const doesFileExist = async (file) => {
    return fs.existsSync(file)
}

const fileNames = {
    github: '../data.json',
    history: '../history.json'
}

export default {
    writeData, writeToFile, doesFileExist, githubData,
    file: fileNames
}