const _plain_text_submit = document.getElementById("plain_text_submit")
const _file_submit = document.getElementById("file_submit")

// Text Encryption

_plain_text_submit.onclick = async () => {

    // Get plain text and password

    const _plain_text = document.getElementById("plain_text")
    const plain_text = _plain_text.value
    const _password = document.getElementById("password")
    const password = _password.value
    const _encrypted_text = document.getElementById("encrypted_text")

    text_encrypt(plain_text, password).then(encrypted_uint8array => btoa(encrypted_uint8array)).then(encrypted_base64 => {
        _encrypted_text.innerText = encrypted_base64
    }).catch(err => {
        console.error(err)
    })

}

// File Encryption

_file_submit.onclick = async () => {

    // Get file and password

    const _file = document.getElementById("file")
    const file = _file.files[0]
    const _password = document.getElementById("password")
    const password = _password.value
    const _download = document.getElementById("download")

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

        _download.innerText = `Download (${encrypted_file.size})`
        _download.href = url
        _download.download = encrypted_file.name
    }).catch(err => {
        console.error(err)
    })

}