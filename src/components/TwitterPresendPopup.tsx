import React, { useState, useEffect } from 'react'
import config from '../config'
import { getPresendDetail, claimPresend } from "../utils/useSola";

export interface TwitterPresendPopupProps {
   images: {
      logoURL: string,
      cheerBG: string
   }
   code: number,
   presendID: number,
   loginUserDomain: string
   authToken: string
}

function TwitterPresendPopup (props: TwitterPresendPopupProps) {
   const { images, code, presendID, loginUserDomain, authToken } = props

   const [badgeletInfo, setBadgeletInfo] = useState(null)
   const [claimed, setClaimed] = useState(false)
   const [errMsg, setErrMsg] = useState(false)

   const handleClaim = async (e) => {
      e.preventDefault()
      setErrMsg('')

      try {
         const claimed = await claimPresend(presendID, code, authToken)
         setClaimed(true)
      } catch (e) {
         setErrMsg(e.message)
      }
   }

   useEffect(() => {
      async function getPresend () {
         const res = await getPresendDetail(presendID)
         setBadgeletInfo(res)

         const claimed = res.badgelets.find(item => {
            return item.receiver.domain === loginUserDomain
         })

         setClaimed(!!claimed)
      }
      getPresend()
   }, [])

   return (
       <div className="sola-presend-card">
          <div className="inner" style={ { backgroundImage: claimed ? `url(${images.cheerBG})` : 'none' } }>
             <img className="logo" src={images.logoURL} alt="" />
             { claimed && <div className="claim-text">Claim Successfully!</div>}
             <img className="badge-cover" src={badgeletInfo ? badgeletInfo.badge.image_url : 'https://app.sociallayer.im/images/avatars/avatar_0.png' } alt="" />
             <div className="badge-name">
                { badgeletInfo ? badgeletInfo.badge.title : 'loading...' }
             </div>
             { !loginUserDomain && <a className="check-btn" href={ config.solaDomain } target="_blank">Login to claim</a> }
             { claimed && loginUserDomain && <a className="check-btn" href={ config.solaDomain } target="_blank">Check in your app</a> }
             { !claimed && loginUserDomain && <div className="claim-btn loginin" onClick={handleClaim}>Claim this badge</div>}
             <div className="err-msg">{ errMsg }</div>
          </div>
       </div>
   )
}

export default TwitterPresendPopup
