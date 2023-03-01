import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './popup.css'
import ProfileDropdown from '../components/ProfileDropdown'
import config from '../config'
import { getBadgeletListByUserID } from '../utils/useSola'
import SolasProfilePreview from '../components/SolasProfilePreview'

async function init () {
    const storage = await chrome.storage.local.get(['user_id', 'user_domain', 'auth_token', 'avatar', 'bind_twitter_id', 'login_twitter_id'])
    const root = ReactDOM.createRoot(document.getElementById('app'))
    const props: FloatPopupProps = {
        domain: storage.user_domain,
        avatar: storage.avatar,
        loginTwitterID: storage.login_twitter_id,
        bindTwitterID: storage.bind_twitter_id,
        authToken: storage.auth_token,
        userID: Number(storage.user_id)
    }
    root.render(<FloatPopup {...props} />)
}

init()



interface FloatPopupProps {
    domain: string,
    avatar: string,
    loginTwitterID: string,
    bindTwitterID: string,
    authToken: string,
    userID: number
}

export function FloatPopup (props: FloatPopupProps) {

    const [domain, setDomain] = useState(props.domain)
    const [avatar, setAvatar] = useState(props.avatar)
    const [loginTwitterID, setLoginTwitterID] = useState(props.loginTwitterID)
    const [bindTwitterID, setBindTwitterID] = useState(props.bindTwitterID)
    const [authToken, setAuthToken] = useState(props.authToken)
    const [userID, setUserID] = useState(props.userID)
    const [badgeList, setBadgeList] = useState([])
    const [showPreview, setShowPreview] = useState(false)

    useEffect(() => {

        function getCurrentTabId() {
            return new Promise((resolve, reject) => {
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    resolve(tabs.length ? tabs[0].id : null)
                })
            })
        }

        async function getLoginTwitter () {
            const tabId: any = await getCurrentTabId()
            if (tabId) {
                chrome.tabs.sendMessage(tabId,{ type:'GET_LOGIN_TWITTER_ID' }, function(loginTwitterId) {
                    if (loginTwitterId) {
                        setLoginTwitterID(loginTwitterId)
                        chrome.storage.local.set( {'login_twitter_id': loginTwitterId})
                    }
                })
            }
        }

        getLoginTwitter()

        window.addEventListener("message", profileChange, false)
        window.postMessage({ type:'GET_LOGIN_TWITTER_ID' }, '*')


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
        setBindTwitterID('')
        setAuthToken('')
        setUserID('')
    }

    const burnLoginTwitterId  = () => {
        setLoginTwitterID(null)
        chrome.storage.local.set( {'login_twitter_id': ''})
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
            { loginTwitterID ?
                <div className="connected-item">
                    <div className="info">
                        <img src="./images/twitter.svg" alt="" />
                        <div className="info-name">
                            <div className="sola-name">{ domain.split('.')[0] }</div>
                            <div className="social-name">@{ loginTwitterID }</div>
                        </div>
                    </div>
                    <div className="actions">
                        { loginTwitterID && (loginTwitterID !== bindTwitterID) ?
                            <a href={`${config.solaDomain}/twitter-verify`} target='_blank' className='verify-twitter-btn'>Verify via Twitter</a>
                            : <div className='verified-status'><span className='mark'></span><span>Verified</span></div>
                        }
                    </div>
                </div>
                :
                <div className="connected-item" style={{ color: "#999" }}>
                        <div>No Twitter Account connected yet~. <a href='https://twitter.com/i/flow/login' target='_blank'> Go to login </a></div>
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
            setBindTwitterID(event.data.bind_twitter_id)
            setAuthToken(event.data.auth_token)
            setUserID(event.data.user_id)
        }
    }
}
