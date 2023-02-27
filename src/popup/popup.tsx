import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './popup.css'
import ProfileDropdown from '../components/ProfileDropdown'
import config from '../config'
import { getBadgeletListByUserID } from '../utils/useSola'
import SolasProfilePreview from '../components/SolasProfilePreview'

async function init () {
    const storage = await chrome.storage.local.get(['user_id', 'user_domain', 'auth_token', 'avatar', 'login_twitter_id'])
    const root = ReactDOM.createRoot(document.getElementById('app'))
    const props: FloatPopupProps = {
        domain: storage.user_domain,
        avatar: storage.avatar,
        twitterID: storage.login_twitter_id,
        authToken: storage.auth_token,
        userID: Number(storage.user_id)
    }
    root.render(<FloatPopup {...props} />)
}

init()



interface FloatPopupProps {
    domain: string,
    avatar: string,
    twitterID: string,
    authToken: string,
    userID: number
}

export function FloatPopup (props: FloatPopupProps) {

    const [domain, setDomain] = useState(props.domain)
    const [avatar, setAvatar] = useState(props.avatar)
    const [twitterID, setTwitterID] = useState(props.twitterID)
    const [authToken, setAuthToken] = useState(props.authToken)
    const [userID, setUserID] = useState(props.userID)
    const [badgeList, setBadgeList] = useState([])
    const [showPreview, setShowPreview] = useState(false)

    useEffect(() => {
        window.addEventListener("message", profileChange, false)


        async function getBadge () {
            const list = await getBadgeletListByUserID(userID)
            if (list) {
                setBadgeList(badgeList)
            }
        }

        getBadge()
        return window.removeEventListener("message", profileChange)
    }, [userID])

    const reset = () => {
        setDomain('')
        setAvatar('')
        setTwitterID('')
        setAuthToken('')
        setUserID('')
    }

    const loginView = <div id="login-view">
        <img className="logo" src="./images/logo.png" />
        <img src="./images/login_bg.png" alt="" className="login-bg" />
        <div className='title'>Connect account</div>
        <div className="login-des">Login in Social Layer in a new tap and connet your social layer domain</div>
        <a href="https://app.sociallayer.im" target="_blank" className="login-btn">Login in</a>
    </div>

    const profileView = <div id="profile-view">
        <div className="header">
            <img className="logo" src="./images/logo_2.png" />
            <ProfileDropdown
                avatarURL={avatar ? avatar : './images/avatar-default.png'}
                domain={domain}
                onLogOut={reset}>
            </ProfileDropdown>
        </div>

        <div className="connected">
            <div className="title">Connect</div>
            { twitterID ?
                <div className="connected-item">
                    <div className="info">
                        <img src="./images/twitter.svg" alt="" />
                        <div className="info-name">
                            <div className="sola-name">{ domain.split('.')[0] }</div>
                            <div className="social-name">{ twitterID }</div>
                        </div>
                    </div>
                    <div className="actions">
                        <button>
                            <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 10L13 14C13 14.3978 12.842 14.7794 12.5607 15.0607C12.2794 15.342 11.8978 15.5 11.5 15.5L2.5 15.5C2.10217 15.5 1.72064 15.342 1.43934 15.0607C1.15803 14.7794 0.999999 14.3978 0.999999 14L0.999999 10M4 4.5L7 1.5M7 1.5L10 4.5M7 1.5L7 11.25" stroke="#5A596E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                :
                <div className="connected-item" style={{ color: "#999" }}>
                        No Twitter ID connected
                </div>
            }
        </div>
        <div className='badge-show'>
            <div className="title">
                <span>Badge show</span>
                <span className='show-preview-btn' onClick={() => { setShowPreview(true) } }>preview</span>
            </div>
            <div className='badge-show-list'>
                <div className='nothing'>
                    <img src="./images/no_badge.svg" alt=""/>
                    <div>No badge yet ~</div>
                </div>
                {
                    badgeList.map((item, index) => (
                        <a key={index} title={item.badge.title}
                           className='badge-show-item'
                           target='_blank' href={`${config.solaDomain}/share/${item.id}`}>
                            <img src={item.badge.image_url} alt=""/>
                        </a>
                    ))
                }
            </div>
        </div>

        <a className="connect-btn" href={config.solaDomain} target='_blank'>Go to Sociallayer</a>
    </div>

    return (
        <div id="sola-popup">
            { domain ? profileView : loginView }
            { showPreview ?
                <div className='show-preview' onClick={(e) => { setShowPreview(!showPreview) }}>
                    <div className='center'>
                        <SolasProfilePreview
                            avatarURL={avatar}
                            domain={domain}
                            badgeList={badgeList}
                        />
                    </div>
                </div> : false }
        </div>
    )

    async function profileChange (event) {
        if (event.source !== window) {
            return
        }

        if (event.data.type && (event.data.type === "PROFILE_CHANGE")) {
            setDomain(event.data.user_domain)
            setAvatar(event.data.avatar)
            setTwitterID(event.data.login_twitter_id)
            setAuthToken(event.data.auth_token)
            setUserID(event.data.user_id)
        }
    }
}
