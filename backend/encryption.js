import * as crypto from 'crypto'

const ALGORITHM = {
    BLOCK_CIPHER: 'aes-256-gcm',
    AUTH_TAG_BYTE_LEN: 16,
    IV_BYTE_LEN: 12,
    KEY_BYTE_LEN: 32,
    SALT_BYTE_LEN: 16
}

const getIV = () => crypto.randomBytes(ALGORITHM.IV_BYTE_LEN)
const key = "42nbFq5cuBYB"

export const encrypt = (text) => {
    const keyBuffer = Buffer.from(key, 'hex')
    const iv = getIV()
    const cipher = crypto.createCipheriv(
        ALGORITHM.BLOCK_CIPHER,
        keyBuffer,
        iv,
        { authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN }
    )
    let encryptedMessage = cipher.update(text, 'utf8')
    encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()])
    return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()]).toString(
        'hex'
    )
}

export const decrypt = (ciphertext) => {
    const keyBuffer = Buffer.from(key, 'hex')
    const ciphertextBuffer = Buffer.from(ciphertext, 'hex')
    const authTag = ciphertextBuffer.slice(-16)
    const iv = ciphertextBuffer.slice(0, 12)
    const encryptedMessage = ciphertextBuffer.slice(12, -16)
    const decipher = crypto.createDecipheriv(
        ALGORITHM.BLOCK_CIPHER,
        keyBuffer,
        iv,
        { authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN }
    )
    decipher.setAuthTag(authTag)
    let text = decipher.update(encryptedMessage)
    text = Buffer.concat([text, decipher.final()])
    return text.toString('utf8')
}

export const sha256Encrypt = (data, key) => {
    const hmac = crypto.createHmac('sha256', key)
    hmac.update(data)
    return hmac.digest('hex')
}