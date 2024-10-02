import SparkMD5 from 'spark-md5'

export function computedMD5(str: string): string {
  return SparkMD5.hash(str)
}

export function computedCryptoKeySHA1(secret: string) {
  const encoder = new TextEncoder()
  const keyMaterial = encoder.encode(secret)

  return window.crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'HMAC', hash: { name: 'SHA-1' } },
    false,
    ['sign'],
  )
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer)
  const base64String = String.fromCharCode(...uint8Array)
  return btoa(base64String)
}

export async function computedHMAC_SHA1(secret: string, value: string, resultType: 'hex' | 'base64' = 'base64') {
  const encoder = new TextEncoder()
  const key = await computedCryptoKeySHA1(secret)
  const data = encoder.encode(value)
  const hashBuffer = await window.crypto.subtle.sign('HMAC', key, data)
  return resultType === 'base64' ? arrayBufferToBase64(hashBuffer) : uint8ArrayToHex(new Uint8Array(hashBuffer))
}

export function uint8ArrayToHex(uint8Array: Uint8Array) {
  return Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function urlsafeBase64Encode(str: string) {
  const encoded = btoa(str)
  return base64ToUrlSafe(encoded)
}

export function base64ToUrlSafe(v: string) {
  return v.replace(/\//g, '_').replace(/\+/g, '-')
}

export function urlSafeToBase64(v: string) {
  return v.replace(/_/g, '/').replace(/-/g, '+')
}
