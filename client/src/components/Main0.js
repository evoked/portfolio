import React, { useState, useEffect } from 'react'
import axios from 'axios'
import header from '../styling/header.scss'

export const Main0 = ({props}) => {
    return (
        <div className="projects"> 
            {props.data ? 
                <div className="primary-container" >
            <ul style={{paddingInlineStart:"0px"}}>{
                props.data.map(project => { 
                    return (
                    <div className="content-container" > 
                    <li className="el" key={project.url}>
                        <div className="el-details">
                            <a href={project.url} className="el-details-title" 
                               target="_blank" rel="noreferrer"><p >{project.name}</p></a>

                            <ul className="el-details-technologies">
                                {project.topics 
                                ? project.topics.map(technology => { return (<li className="technologies-el"style={{paddingLeft: "3px", paddingRight: "3px"}}> {technology}</li>)}) 
                                : <p>no</p>}
                                {console.log(project.name)}
                            </ul>
                        </div>
                        
                        <p style={{margin: "5px 0px 5px 0px"}}>{project.description}</p>

                        <div>
                            { project.images ?
                                project.images.map(image => {
                                    console.log(image);   
                                    return (
                                        <img height="50%" width="50%" 
                                        src={image} style={{borderRadius:"10px", minWidth:"50%", marginLeft:"auto",marginRight:"auto"}}/>
                                    )
                                })
                            : <p>no images available</p>
                            } 
                        </div>  
                    </li>
                    </div>
                    )
                })}</ul>
                </div>
            : 
            <p>loading</p>    
        }
        </div>
    )
}
