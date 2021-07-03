import React, { useState, useEffect } from 'react'
import axios from 'axios'

export const Main0 = ({props}) => {
    return (
        <div class="views"> 
            <h2>Projects</h2>
            {props.data ? 
            <ul>{props.data.map(project => {
                return (
                    <div>
                        <li key={project.url}>
                        <a href={project.url}><p>{project.name}</p></a>
                        <p>{project.description}</p>
                         <div>
                            { project.images ?
                                project.images.map(image => {
                                    console.log(image);   
                                    return (
                                        <img height="50%" width="50%" 
                                        src={image} />
                                    )
                                })
                            : <p>{project.images}</p>
                            } 
                        </div>  
                        </li>
                    </div>
                    )
            })}</ul>
            : 
            <p>loading</p>    
        }
        </div>
    )
}
