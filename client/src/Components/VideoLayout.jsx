import React from 'react'
import ReactPlayer from "react-player";

function VideoLayout({streamSrc}) {
    return (
        <div className='rounded-lg p-2'>
            <ReactPlayer
            playing
            muted
            height="500px"
            width="550px"
            url={streamSrc}
          />
        </div>
    )
}

export default VideoLayout
