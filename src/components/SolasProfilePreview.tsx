import React, { useState, useEffect } from 'react'
import config from "../config";

export interface ProfileDropdownProps {
    avatarURL: string
    domain: string,
    badgeList: any[]
}

function ProfileDropdown (props: ProfileDropdownProps) {
    const { avatarURL, domain, badgeList } = props

    const [showList, setShowList] = useState(false)

    return (
        <div className="solas-preview">
            <div className='bg'></div>
            <img className='avatar' src={avatarURL} alt=""/>
            <div className='userName'>{ domain.split('.')[0] }</div>
            <a className='domain'>{ domain }</a>
            <div className='badge-list'>
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
            <div className='footer-mark'>
                <img src="./images/footer_mark.png" alt=""/>
            </div>
        </div>
    )
}

export default ProfileDropdown
