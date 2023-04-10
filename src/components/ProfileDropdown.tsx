import React, { useState, useEffect } from 'react'

export interface ProfileDropdownProps {
    avatarURL: string
    domain: string
    onLogOut: () => any
}

function ProfileDropdown (props: ProfileDropdownProps) {
    const { avatarURL, domain } = props

    const [showList, setShowList] = useState(false)

    const switchShow = (e) => {
        e.stopPropagation()
        setShowList(!showList)
    }

    const signOut = (e) => {
        e.stopPropagation()
        chrome.storage.local.set({
            user_id: null,
            auth_token: '',
            user_domain: '',
            avatar: '',
            bind_twitter_id: ''
        }).then(() => {
            props.onLogOut()
            setShowList(false)
        })
    }

    const list = <div className="dropdown-list" onClick={switchShow}>
        <div className="content">
            <div className="profile">
                <img src={avatarURL} alt=""/>
                <div className="info">
                    <div className="name">{ domain.split('.')[0] }</div>
                    <div className="domain">{ domain }</div>
                </div>
            </div>
            <div className="sign-out" onClick={signOut}>Sign out</div>
        </div>
    </div>

    if (domain) {
        return (
           <div className="profile-dropdown">
               <div className="dropdown-btn" onClick={switchShow}>
                   <img src={avatarURL} alt=""/>
                   <div>{ domain.split('.')[0] }</div>
                   <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path fill-rule="evenodd" clip-rule="evenodd" d="M9.02446 0.175736C8.79014 -0.0585787 8.41025 -0.0585788 8.17593 0.175736L4.60019 3.75147L1.02446 0.175736C0.790145 -0.0585791 0.410246 -0.0585791 0.175931 0.175736C-0.058384 0.41005 -0.058384 0.789949 0.175931 1.02426L3.99915 4.84749C4.3311 5.17943 4.86929 5.17943 5.20124 4.84749L9.02446 1.02426C9.25877 0.789949 9.25877 0.410051 9.02446 0.175736Z" fill="#566470"/>
                   </svg>
               </div>
               { showList ? list : false }
           </div>
        )
    } else {
        return false
    }
}

export default ProfileDropdown
