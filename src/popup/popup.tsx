import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './popup.css'
import Spline from '@splinetool/react-spline'

const ANIMATION = chrome.runtime.getURL('/scene.splinecode')
console.log('ANIMATION', ANIMATION)

async function init () {
    const storage = await chrome.storage.local.get(['user_id', 'user_domain', 'auth_token', 'avatar', 'login_twitter_id'])
    console.log('storage', storage)
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

    useEffect(() => {
        window.addEventListener("message", profileChange, false)
        return window.removeEventListener("message", profileChange)
    }, [])

    const loginView = <div id="login-view">
        <img className="logo" src="./images/logo.png" />
        <img src="./images/login_bg.png" alt="" className="login-bg" />
        <a href="https://app.sociallayer.im" target="_blank" className="login-btn">Login in Social Layer</a>
        <div className="login-des">Login in Social Layer in a new tap and connet your social layer domain</div>
    </div>

    const profileView = <div id="profile-view">
        <div className="header">
            <img className="logo" src="./icons/48.png" />
            <div className="domain">
                <img src={ avatar ? avatar : './images/avatar-default.png'} className="avatar" />
                <div className="name">{ domain }</div>
            </div>
        </div>

        {/*<img className="profile-bg" src="./images/profile_bg.png" alt="" />*/}
        <iframe className="animation" src="https://social-layer-app-dev.vercel.app/animation.html"></iframe>

        <div className="connected">
            <div className="title">Account connected</div>
            <div className="connected-item">
                <div className="info">
                    <img src="./images/twitter.png" alt="" />
                        <div className="info-name">
                            <div className="sola-name">{ domain.split('.')[0] }</div>
                            <div className="social-name">{ twitterID }</div>
                        </div>
                </div>
                <div className="actions">
                    <button>Disconnect</button>
                </div>
            </div>
        </div>

        <div className="connect-btn">Connect other account</div>
    </div>

    return (
        <div id="sola-popup">
            { domain ? profileView : loginView }
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
