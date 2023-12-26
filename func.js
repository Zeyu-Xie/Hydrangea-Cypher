const encoder = new TextEncoder()
const decoder = new TextDecoder()

const iv = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])

const uint8array_to_cryptokey = async password_uint8array_ => {
    return await crypto.subtle.importKey(
        "raw",
        password_uint8array_,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    )
}

const uint8array_encrypt = async (uint8array, password) => {

    const password_uint8array_tmp = encoder.encode(password)
    const password_length = password_uint8array_tmp.length
    const password_uint8array = new Uint8Array(16)
    password_uint8array.set(password_uint8array_tmp, 0)

    for (let i = password_length; i < 16; i++) {
        password_uint8array[i] = 16 - password_length
    }

    return await uint8array_to_cryptokey(password_uint8array).then(async password_cryptokey => {
        return await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            password_cryptokey,
            uint8array
        ).then(encrypted_buffer => new Uint8Array(encrypted_buffer))
    })
}

const text_encrypt = async (text, password) => {
    const text_uint8array = encoder.encode(text)
    return await uint8array_encrypt(text_uint8array, password)
}

const readAsText_packed = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = evt => {
            const fileContent = evt.target.result
            resolve(fileContent)
        }
        reader.onerror = err => {
            reject(err);
        }
        reader.readAsArrayBuffer(file)
    })
}