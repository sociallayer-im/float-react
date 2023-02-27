import React, { useState, useEffect } from 'react'
import config from '../config'
import { getBadgeletListByUserID, getProfileByTwitterID } from '../utils/useSola'
import * as Lens from '../utils/useLens'

export interface TwitterAvatarPopupProps {
    images: {
        loadingIMG: string,
        logoIMG: string,
        namebgIMG: string
        lensterIMG: string
    },
    twitterID: string
    script: string
}

function TwitterAvatarPopup (props: TwitterAvatarPopupProps) {
    const { images, twitterID, script } = props

    const [loading, setLoading] = useState(true)
    const [userProfile, setProfile] = useState(null)
    const [badgeList, setBadgeList] = useState([])
    const [lensProfile, setLensProfile] = useState(null)

    useEffect(() => {
        async function getProfileInfo() {
            if (userProfile) return
            const res = await getProfileByTwitterID(twitterID)
            setProfile(res)

            console.log('setProfile', res)
            if (res && res.address) {
                const lensProfile = await getLensProfile(res.address)
                if (lensProfile) {
                    setLensProfile(lensProfile)

                    setTimeout(() => {
                        const linkTag = document.createElement("link")
                        linkTag.setAttribute('rel', 'stylesheet')
                        linkTag.setAttribute('href', 'https://lens.xyz/widget-styles.css')

                        const scriptTag = document.createElement("script")
                        scriptTag.setAttribute('src', script)

                        document.querySelector('head').appendChild(linkTag)
                        document.querySelector('head').appendChild(scriptTag)
                    }, 1500)
                }
            }

            if (res) {
                const badges = await getBadgeletListByUserID(res.id)
                setBadgeList(badges)
            }

            setLoading(false)
        }

        async function getLensProfile (address) {
            return await Lens.getProfile(address)
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

                { lensProfile ?
                    <div className='lens-profile'>
                        <div className='info'>
                            <img className='avatar' src= {
                                lensProfile.picture?.original?.url ?
                                    lensProfile.picture?.original.url.includes('ipfs') ?
                                        `${config.ipfsGateway}${lensProfile.picture?.original.url.replace('ipfs://', '')}`
                                        : lensProfile.picture?.original.url
                                    : './images/lenster.svg'
                            } alt=""/>
                            <div className='name-info'>
                                <div className='name'>{ lensProfile.name || lensProfile.id }</div>
                                <div className='handle'>@{ lensProfile.handle.replace('.lens', '') }</div>
                            </div>
                        </div>
                        <a className='lens-follow-btn'
                           href={`https://lensfrens.xyz/${lensProfile.handle}/follow`}
                           target='_blank'
                           title='Follow'
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 5V7M11 7V9M11 7H13M11 7H9M7.66667 3.66667C7.66667 4.37391 7.38572 5.05219 6.88562 5.55229C6.38552 6.05238 5.70724 6.33333 5 6.33333C4.29276 6.33333 3.61448 6.05238 3.11438 5.55229C2.61428 5.05219 2.33333 4.37391 2.33333 3.66667C2.33333 2.95942 2.61428 2.28115 3.11438 1.78105C3.61448 1.28095 4.29276 1 5 1C5.70724 1 6.38552 1.28095 6.88562 1.78105C7.38572 2.28115 7.66667 2.95942 7.66667 3.66667ZM1 12.3333C1 11.2725 1.42143 10.2551 2.17157 9.50491C2.92172 8.75476 3.93913 8.33333 5 8.33333C6.06087 8.33333 7.07828 8.75476 7.82843 9.50491C8.57857 10.2551 9 11.2725 9 12.3333V13H1V12.3333Z" stroke="#8362EE" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                    </div> : false }
            </div>
        )
    } else {
        return false
    }
}

export default TwitterAvatarPopup
