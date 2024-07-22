import CryptoJS from 'crypto-js'
import { nanoid } from 'nanoid/non-secure'

declare type Request = {
  headers: { [key: string]: string }
}
declare type RequestCallback = (request: Request, context: unknown) => Request
declare function addHandler(type: 'transform', callback: RequestCallback)
declare const process: { env: { [key: string]: string } }

type Params = {
  token: string
  t: number
  nonce: string
  secret: string
}

function sign(params: Params): string {
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(
      `${params.token}${params.t}${params.nonce}`,
      params.secret,
    ),
  )
}

addHandler('transform', (request, context) => {
  const token = process.env['SWITCHBOT_TOKEN']
  const secret = process.env['SWITCHBOT_SECRET']
  const nonce = nanoid()
  const t = Date.now()

  request.headers['Authorization'] = token
  request.headers['t'] = `${t}`
  request.headers['sign'] = sign({ token, t, nonce, secret })
  request.headers['nonce'] = nonce
  return request
})
