import React from 'react'
import ReactPlayer from "react-player";

function VideoLayout({ streamSrc, ht, wd }) {
    return (
        <div className='flex justify-center'>
            <ReactPlayer
                playing
                muted
                height={ht}
                width={wd}
                url={streamSrc}
            />
        </div>
    )
}

export default VideoLayout
