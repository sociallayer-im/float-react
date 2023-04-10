import React, { useState, useEffect } from 'react'
import { getBadgeletListByUserID, getProfileByTwitterID } from "../utils/useSola"
import * as lens from '../utils/useLens'
import SolasProfilePreview from './SolasProfilePreview'
import LensProfilePreview from './LensProfilePreview'



export interface SolasAndLensPreviewInTwitterProfileProps {
    images: {
        solasLogo: string
        lensterLogo: string,
        solasDefaultAvatar: string
        footerMark: string
    },
    twitterId: string
}

function SolasAndLensPreviewInTwitterProfile (props: SolasAndLensPreviewInTwitterProfileProps) {
    const [solasProfile, setSolasProfile] = useState(null)
    const [lensProfile, setLensProfile] = useState(null)
    const [badges, setBadges] = useState([])

    useEffect(() => {
        async function getProfile() {
            const solasProfile = await getProfileByTwitterID(props.twitterId)
            setSolasProfile(solasProfile)
            console.log('solasProfile', solasProfile)

            if (solasProfile) {
                const badges = await getBadgeletListByUserID(solasProfile.id)
                setBadges(badges)

                if (solasProfile.address) {
                    const lensProfile = await lens.getProfile(solasProfile.address)
                    setLensProfile(lensProfile)
                }
            }
        }

        getProfile()
    }, [])

    return (<div className='solas-lens-preview-in-twtter-profile'>
        { solasProfile ? <div className='solas item'>
            <div className='logo'><img src={ props.images.solasLogo } alt=""/></div>
            <div className='name'>{ props.twitterId }</div>
            <SolasProfilePreview
                avatarURL={ solasProfile.image_url || props.images.solasDefaultAvatar }
                domain={ solasProfile.domain }
                badgeList={ badges }
                markImg={ props.images.footerMark }
            />
        </div> : false }
        { lensProfile ? <div className='lans item'>
            <div className='logo'> <img src={ props.images.lensterLogo } alt=""/></div>
            <div className='name'>@{ lensProfile.handle }</div>
            <LensProfilePreview
            defaultAvatarURL={ props.images.lensterLogo }
            lensProfile={ lensProfile }
            markImg={ props.images.footerMark }
            />
        </div> : false }
    </div>)
}

export default SolasAndLensPreviewInTwitterProfile
