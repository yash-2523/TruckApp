
import { CameraAltOutlined, Cancel } from '@material-ui/icons'
import React from 'react'

export default function ImageUploader(props) {
    return (
        <div className="image-uploader">

            {props.imageSrc===false ? 
            <div className="position-relative image-input-container">
                <CameraAltOutlined className="position-absolute" />
                <input type="file" onChange={props.handleImageSelect}></input>
            </div>
            :
            <div className="position-relative image-container">
                <img src={props.imageSrc}></img>
                <Cancel className="position-absolute" onClick={props.RemoveImageSrc} />
            </div>
            }
        </div>
    )
}
