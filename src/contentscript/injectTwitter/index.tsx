import React from "react"
import ReactDOM from 'react-dom/client'
import TwitterAvatarPopup, { TwitterAvatarPopupProps } from '../../components/TwitterAvatarPopup'
import TwitterPresendPopup, { TwitterPresendPopupProps } from '../../components/TwitterPresendPopup'
import { getPresendInfoFormURL } from '../../utils/useSola'
import '../injectStyle.css'

/**
 * 通过插件API获得一些静态文件地址
 */
const IMAGE_LOADING = chrome.runtime.getURL('/images/loading.svg')
const IMAGE_LOGO = chrome.runtime.getURL('/icons/128.png')
const IMAGE_NAMEBG = chrome.runtime.getURL('/images/name_bg.png')
const IMAGE_CHEER = chrome.runtime.getURL('/images/cheer.png')
const IMAGE_LOGO_WITH_NAME = chrome.runtime.getURL('/images/logo.png')

/**
 * 原理：鼠标移动到 Twitter 头像后会弹出一个展示用户简要信息
 * 的卡片，通过监听 Dom 树的改变事件，检测这个卡片
 * 的’出现‘和’消失‘事件，若卡片出现，则在卡片插入 SocialLayer
 * 信息并停止监听’出现‘事件。若消失则恢复监听’出现‘事件。
 */
document.addEventListener('DOMSubtreeModified', bindTwitterAvatarHoverEvent)

function bindTwitterAvatarHoverEvent () {
    // 获取卡片，没有卡片则不操作
    const twitterAvatarHoverCard = document.querySelector('#layers div[data-testid="HoverCard"]')
    if (!twitterAvatarHoverCard) return
    const positionDom = twitterAvatarHoverCard.querySelector('div > div > div.css-1dbjc4n.r-13awgt0.r-18u37iz.r-1w6e6rj')
    if (!positionDom) return

    // 获取卡片后停止监听，防止重复弹出
    document.removeEventListener('DOMSubtreeModified', bindTwitterAvatarHoverEvent)

    // 监听卡片消失事件，若消失后需要重新监听出现事件
    document.addEventListener('DOMSubtreeModified', bindTwitterAvatarCancelHoverEvent)

    // 定位并插入信息
    const destDom = twitterAvatarHoverCard.querySelector('div.css-1dbjc4n.r-nsbfu8')
    const wrapperDom = document.createElement('div')
    destDom.appendChild(wrapperDom)

    if (destDom) {
        const props: TwitterAvatarPopupProps = {
            images: {
                logoIMG: IMAGE_LOGO,
                loadingIMG: IMAGE_LOADING,
                namebgIMG: IMAGE_NAMEBG
            },
            twitterID: document.querySelector('#layers > div.css-1dbjc4n.r-1p0dtai.r-1d2f490.r-105ug2t.r-u8s1d.r-zchlnj.r-ipm5af > div > div > div > div > div > div > div > div > div.css-1dbjc4n.r-knv0ih > div > div > div > a > div > div > span').innerHTML
        }
        const root = ReactDOM.createRoot(wrapperDom)
        root.render(<TwitterAvatarPopup
            images={ props.images }
            twitterID={ props.twitterID }
        />)
    }
}

function bindTwitterAvatarCancelHoverEvent () {
    if (!document.querySelector('#layers div[data-testid="HoverCard"]')) {
        document.removeEventListener('DOMSubtreeModified', bindTwitterAvatarCancelHoverEvent)
        document.addEventListener('DOMSubtreeModified', bindTwitterAvatarHoverEvent)
        console.info('[Sola]: Hide avatar popup')
    }
}

/**
 * 原理：获取当前页面所有推文，匹配到含有 presend 分享链接的推文在在 Dom
 * 中插入 presend 卡片
 */
document.addEventListener('DOMSubtreeModified', scanPresend)

function scanPresend () {
    const tweetTextDoms = document.querySelectorAll('div[data-testid=tweetText]')
    if (!tweetTextDoms.length) return

    tweetTextDoms.forEach(dom => {
        if (dom.className.includes('sola-presend')) {
            return
        }

        dom.className = dom.className + ' sola-presend'
        const presendLink = dom.innerHTML.match(/https:[^\s]*\/presend\/[^d]*_[^d]{7}/i)[0]
        if (!presendLink) return

        chrome.storage.local.get(['user_domain','auth_token']).then(storage => {
            const { user_domain, auth_token } = storage
            const { presendID, code } = getPresendInfoFormURL(presendLink)
            const card = document.createElement('div')
            dom.appendChild(card)

            const root = ReactDOM.createRoot(card)
            const props:TwitterPresendPopupProps = {
                images: {
                    logoURL: IMAGE_LOGO_WITH_NAME,
                    cheerBG: IMAGE_CHEER
                },
                presendID: Number(presendID),
                code: Number(code),
                loginUserDomain: user_domain,
                authToken: auth_token
            }
            root.render(<TwitterPresendPopup {...props} />)
        })
        })

}
