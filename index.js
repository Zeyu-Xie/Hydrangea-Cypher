const encoder = new TextEncoder()
const decoder = new TextDecoder()

const _button_1 = document.getElementById("button_1")
const _button_2 = document.getElementById("button_2")
const _button_3 = document.getElementById("button_3")
const _button_4 = document.getElementById("button_4")

// Text Encryption

_button_1.onclick = () => {

    const _p_1 = document.getElementById("p_1")

    _p_1.innerText=btoa(String.fromCharCode.apply(null, Array.from((aes_encrypt(encoder.encode(document.getElementById("textarea_1").value), encoder.encode(document.getElementById("input_1").value))))))

}

// File Encryption

_button_2.onclick = async () => {

    // Get file and password

    const file = document.getElementById("input_file_2").files[0]
    const password = document.getElementById("input_2").value
    
    const _a_2 = document.getElementById("a_2")

    // Get file data and info

    const name = file.name
    const type = file.type
    const size = file.size
    const lastModified = file.lastModified
    const lastModifiedDate = file.lastModifiedDate
    const webkitRelativePath = file.webkitRelativePath

    // Encrypt

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
            reader.readAsText(file)
        })
    }

    await readAsText_packed(file).then(content_string => encoder.encode(content_string)).then(content_uint8array => aes_encrypt(encoder.encode(content_uint8array), encoder.encode(password))).then(encrypted_content_uint8array => {
                
        let encrypted_file = new File([encrypted_content_uint8array], `${name}.encrypted`, {
            type: "application/octet-stream"
        })
        encrypted_file.metadata = {
            name: name,
            type: type,
            lastModified: lastModified,
            lastModifiedDate: lastModifiedDate,
            webkitRelativePath: webkitRelativePath
        }
        return encrypted_file
    }).then(encrypted_file => {
        const url = URL.createObjectURL(encrypted_file)

        _a_2.innerText = `Download (${encrypted_file.size})`
        _a_2.href = url
        _a_2.download = encrypted_file.name
    }).catch(err => {
        console.error(err)
    })

}

// Text Decryption

_button_3.onclick = async () => {

    const _p_3 = document.getElementById("p_3")

    uint8array_decrypt(encoder.encode(btoa(document.getElementById("textarea_3"))), document.getElementById("input_3").value).then(decrypted_uint8array => {
        const decrypted_string = decoder.decode(decrypted_uint8array)
        return btoa(decrypted_string)
    }).then(decrypted_base64 => {
        _p_3.innerText = decrypted_base64
    }).catch(err => {
        console.error(err)
    })

}