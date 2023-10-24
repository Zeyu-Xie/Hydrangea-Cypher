const _fileUpload2 = document.querySelector("input[id='fileUpload2']")
const _passphraseInput2 = document.querySelector("input[id='passphraseInput2']")
const _encryptButton2 = document.querySelector("button[id='encryptButton2']")
const _decryptButton2 = document.querySelector("button[id='decryptButton2']")
const _copyButton2 = document.querySelector("button[id='copyButton2']")
const _downloadLink2 = document.querySelector("a[id='downloadLink2']")

_encryptButton2.addEventListener("click", () => {
    const file = _fileUpload2.files[0]
    const passphrase = _passphraseInput2.value
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onloadend = evt => {
        const fileStr = evt.target.result
        const fileName = file.name
        const fileType = file.type
        const encryptedContent = Aes.encrypt(fileType.padStart(64, "0") + fileStr, passphrase).toString().substring(10)
        const encryptedFileName = Aes.encrypt(fileName, passphrase).toString().substring(10).replace(/\//g, "_")+ ".acan"
        const encryptedBlob = new Blob([encryptedContent], { type: "application/octet-stream" });
        const encryptedFile = new File([encryptedBlob], encryptedFileName, { type: "application/octet-stream" })
        const encryptedFileLink = URL.createObjectURL(encryptedFile)
        _downloadLink2.href = encryptedFileLink
        _downloadLink2.download = encryptedFileName
    }
})

_decryptButton2.addEventListener("click", () => {

    const file = _fileUpload2.files[0]
    const passphrase = _passphraseInput2.value
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onloadend = evt => {

        const fileStr = evt.target.result
        const fileName = file.name.replace(/_/g, "/");
        const decryptedBytes = Aes.decrypt("U2FsdGVkX1" + fileStr, passphrase)
        const decryptedContent = decryptedBytes.toString(Enc.Utf8)
        const decryptedFileNameBytes = Aes.decrypt("U2FsdGVkX1" + fileName.substring(0, fileName.length - 5), passphrase)
        const decryptedFileName = decryptedFileNameBytes.toString(Enc.Utf8)

        let decryptedFileType = decryptedContent.substring(0, 64)
        const decryptedFileContent = decryptedContent.substring(64)

        for (i = 0; i < 64; i++) {
            if (decryptedFileType[i] != "0") {
                decryptedFileType = decryptedFileType.substring(i)
                break
            }
        }
        const decryptedBlob = new Blob([decryptedFileContent], { type: decryptedFileType });
        const decryptedFile = new File([decryptedBlob], decryptedFileName, { type: decryptedFileType })

        const decryptedFileLink = URL.createObjectURL(decryptedFile)
        _downloadLink2.href = decryptedFileLink
        _downloadLink2.download = decryptedFileName
    }
})