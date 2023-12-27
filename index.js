const _button_1 = document.getElementById("button_1")
const _button_2 = document.getElementById("button_2")
const _button_3 = document.getElementById("button_3")
const _button_4 = document.getElementById("button_4")

// Text Encryption

_button_1.onclick = async () => {

    const _p_1 = document.getElementById("p_1")

    text_encrypt(document.getElementById("textarea_1").value, document.getElementById("input_1").value).then(encrypted_uint8array => {
        const encrypted_string = String.fromCharCode.apply(null, encrypted_uint8array)
        return btoa(encrypted_string)
    }).then(encrypted_base64 => {
        _p_1.innerText = encrypted_base64
    }).catch(err => {
        console.error(err)
    })

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

    await readAsText_packed(file).then(content_arraybuffer => new Uint8Array(content_arraybuffer)).then(async content_uint8array => await uint8array_encrypt(content_uint8array, password)).then(encrypted_content_uint8array => {
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