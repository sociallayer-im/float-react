import {getProfileById} from "../../utils/useSola";

/**
 * 监听login和logout事件
 */
window.addEventListener("message", async (event) => {
    if (event.source !== window) {
        return
    }

    if (event.data.type && (event.data.type === "SOLA_LOGIN")) {
        await chrome.storage.local.set({
            user_id: Number(event.data.user_id),
            auth_token: event.data.auth_token,
        })

        const profile = await getProfileById(Number(event.data.user_id))
        console.log('profile', profile)
        await chrome.storage.local.set({
            avatar: profile.image_url,
            bind_twitter_id: profile.twitter,
            user_domain: profile.domain,
        })

        profileChange({
            user_id: Number(event.data.user_id),
            auth_token: event.data.auth_token,
            avatar: profile.image_url,
            bind_twitter_id: profile.twitter,
            user_domain: profile.domain,
        })
    }

    if (event.data.type && (event.data.type === "SOLA_LOGOUT")) {

        await chrome.storage.local.set({
            user_id: 0,
            user_domain: '',
            auth_token: '',
            avatar: '',
            bind_twitter_id: ''
        })

        profileChange({
            user_id: 0,
            user_domain: '',
            auth_token: '',
            avatar: '',
            bind_twitter_id: ''
        })
    }

}, false)


function profileChange (storage) {
    window.postMessage({ type:'PROFILE_CHANGE', ...storage }, '*')
}
