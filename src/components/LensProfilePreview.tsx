import React from 'react'
import config from '../config'

export interface LensProfilePreviewProps {
    defaultAvatarURL: string
    lensProfile: any,
    markImg: string
}

function LensProfilePreview (props: LensProfilePreviewProps) {
    const avatar = props.lensProfile.picture?.original?.url ?
        props.lensProfile.picture?.original?.url.includes('ipfs://') ?
            `${config.ipfsGateway}${props.lensProfile.picture?.original?.url.replace('ipfs://', '')}` :
            `${config.ipfsGateway}${props.lensProfile.picture?.original?.url}`
        : props.defaultAvatarURL

    const gateway = 'https://user-content.lenster.xyz/1500x500/https://gateway.ipfscdn.io/ipfs/'

    const coverPic = props.lensProfile.coverPicture?.original?.url ?
        props.lensProfile.coverPicture?.original?.url.includes('ipfs://') ?
            `${gateway}${props.lensProfile.coverPicture?.original?.url.replace('ipfs://', '')}` :
            `${gateway}${props.lensProfile.coverPicture?.original?.url}`
        : null


    return (
        <div className="solas-preview lens">
            { coverPic ? <img className='bg' src={coverPic} alt=""/> : <div className='bg'></div> }
            <img className='avatar' src={ avatar } alt=""/>
            <div className='userName'>{ props.lensProfile.name || props.lensProfile.id }</div>
            <div className='userId'>@{ props.lensProfile.handle.replace('.lens', '') }</div>
            <div className='bio'>{ props.lensProfile.bio }</div>
            <a className='view-btn' target='_blank' href={`https://lenster.xyz/u/${props.lensProfile.handle.replace('.lens', '')}`}>View profile</a>
            <div className='footer-mark'>
                <img src={ props.markImg ? props.markImg : "./images/footer_mark.png"} alt=""/>
            </div>
        </div>
    )
}

export default LensProfilePreview
