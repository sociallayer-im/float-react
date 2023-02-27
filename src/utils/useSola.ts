import axios from 'axios'
import config from '../config'

export async function getProfileByTwitterID (twitterID: string) {
    twitterID = twitterID.replace('@','')
    try {
        const res = await axios.get(`${config.apiURL}/profile/get`, { params: { twitter: twitterID } })
        return res.data.profile || null
    } catch (e) {
        console.log(e.message)
        return null
    }
}

export async function getBadgeletListByUserID (solaUserID: number) {
    try {
        const res = await axios.get(`${config.apiURL}/badgelet/list`, { params: { show_hidden: false, receiver_id: solaUserID } })
        let list =  res.data.badgelets || []
        list = list.filter(item => {
            return item.status !== 'rejected'
        })
        return list.slice(0, 5)
    } catch (e) {
        console.log(e.message)
        return []
    }
}

export function getPresendInfoFormURL (url: string) {
    const array = url.split('/')
    const info = array[array.length - 1]
    const infoArray = info.split('_')
    return {
        presendID: infoArray[0],
        code: infoArray[1]
    }
}

export async function getPresendDetail (presendID: number) {
    try {
        const res = await axios.get(`${config.apiURL}/presend/get`, { params: { id: presendID } })
        return res.data.presend || null
    } catch (e) {
        console.log(e.message)
        return null
    }
}

export async function claimPresend (presendID: number, code: number, authToken: string) {
    await axios.post(`${config.apiURL}/presend/use`, { id: presendID, code, auth_token: authToken })
}

export async function getProfileById (userId: number) {
    try {
        const res = await axios.get(`${config.apiURL}/profile/get`, { params: { id: userId } })
        return res.data.profile || null
    } catch (e) {
        console.log(e.message)
        return null
    }
}
