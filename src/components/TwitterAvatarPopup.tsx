import React, { useState, useEffect } from 'react'
import config from '../config'
import {getBadgeletListByUserID, getProfileByTwitterID} from '../utils/useSola'

export interface TwitterAvatarPopupProps {
    images: {
        loadingIMG: string,
        logoIMG: string,
        namebgIMG: string
    },
    twitterID: string
}

function TwitterAvatarPopup (props: TwitterAvatarPopupProps) {
    const { images, twitterID } = props

    const [loading, setLoading] = useState(true)
    const [userProfile, setProfile] = useState(null)
    const [badgeList, setBadgeList] = useState([])

    useEffect(() => {
        async function getProfileInfo() {
            if (userProfile) return
            const res = await getProfileByTwitterID(twitterID)
            setProfile(res)

            if (res) {
                const badges = await getBadgeletListByUserID(res.id)
                setBadgeList(badges)
            }

            setLoading(false)
        }

        getProfileInfo()
    }, [])

    if (loading) {
       return (
           <div className="float-twitter-avatar-popup">
               <img className="sola-loading" src={images.loadingIMG} />
           </div>
       )
    } else if (userProfile) {
        return (
            <div className="float-twitter-avatar-popup">
                <div className="sola-profile">
                    <img src={images.logoIMG} />
                    <span className="sola-domain"
                          style={{backgroundImage: `url(${images.namebgIMG})`}}>
                        { userProfile.domain }
                    </span>
                </div>
                <div className="sola-badges">
                    {
                        badgeList.map(item => {
                            return (
                                <a target="_blank" href={`${config.solaDomain}/share/${item.id}`}
                                   key={item.id.toString()}
                                   title={item.badge.title}>
                                    <img src={item.badge.image_url} />
                                </a>
                            )
                        })
                    }
                </div>
                <a target="_blank" className="sola-send-btn" href={`${config.solaDomain}/badge/mint?to=${userProfile.domain}`}>{
                    `Send badge to ${twitterID}`}</a>
            </div>
        )
    } else {
        return false
    }
}

export default TwitterAvatarPopup
