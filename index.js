const Sha256 = CryptoJS.SHA256
const Aes = CryptoJS.AES
const Enc = CryptoJS.enc
const Md5 = CryptoJS.MD5

const _contentInput = document.querySelector("textarea[id='contentInput']")
const _passphraseInput = document.querySelector("input[id='passphraseInput']")
const _encryptButton = document.querySelector("button[id='encryptButton']")
const _decryptButton = document.querySelector("button[id='decryptButton']")
const _copyButton = document.querySelector("button[id='copyButton']")
const _result = document.querySelector("div[id='result']")

const getMd5 = str => {
    const str_md5_hex = Md5(str).toString()
    let str_md5_ascii = []
    for (let i = 0; i < 32; i += 2) {
        str_md5_ascii.push(parseInt(str_md5_hex[i] + str_md5_hex[i + 1], 16))
    }
    return String.fromCharCode.apply(null, str_md5_ascii);
}

_encryptButton.addEventListener("click", () => {
    showSpinner()
    try {
        const content = _contentInput.value
        const passphrase = _passphraseInput.value
        const passphrase_md5_ascii = getMd5(passphrase)
        const encryptedContent = Aes.encrypt(content, passphrase_md5_ascii).toString()
        _result.innerText = encryptedContent.substring(10)
    } catch (err) {
        console.log("ERROR", err)
    }
    hideSpinner()
})

_decryptButton.addEventListener("click", () => {
    showSpinner()
    try {
        const content = "U2FsdGVkX1" + _contentInput.value
        const passphrase = _passphraseInput.value
        const passphrase_md5_ascii = getMd5(passphrase)
        const decryptedBytes = Aes.decrypt(content, passphrase_md5_ascii)
        const decryptedContent = decryptedBytes.toString(Enc.Utf8)
        _result.innerText = decryptedContent
    } catch (err) {
        console.log("ERROR", err)
    }
    hideSpinner()
})

_copyButton.addEventListener("click", () => {
    const clipboardItem = new ClipboardItem({ "text/plain": new Blob([_result.innerText]) });
    navigator.clipboard.write([clipboardItem]).then(
        function () {
            window.alert("Copy Successfully")
            console.log("Copy Successfully")
        },
        function (err) {
            window.alert("Copy Failed")
            console.error("ERROR", err)
        }
    )
})