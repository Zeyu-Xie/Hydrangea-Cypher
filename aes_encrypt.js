const aes_encrypt = (plaintext_uint8array_tmp, key_uint8array_tmp) => {

    // Rcon Array

    const rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36]
    
    // Sbox Mapping
    
    const sbox_mapping = value => {
        const sbox = [
            [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76],
            [0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0],
            [0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15],
            [0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75],
            [0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84],
            [0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf],
            [0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8],
            [0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2],
            [0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73],
            [0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb],
            [0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79],
            [0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08],
            [0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a],
            [0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e],
            [0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf],
            [0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]
        ]
        const value_x = Math.floor(value / 16)
        const value_y = Math.floor(value - 16 * value_x)
        return sbox[value_x][value_y]
    }

    // Operation 1. subBytes

    const subBytes = str_uint8array => {
        let result_length = str_uint8array.length
        let result_uint8array = new Uint8Array(result_length)
        for (let i = 0; i < result_length; i++) {
            result_uint8array[i] = sbox_mapping(str_uint8array[i])
        }
        return result_uint8array
    }

    // Operation 2. shiftRows 

    const shiftRows = str_uint8array => {

        let result_uint8array = new Uint8Array(16)

        // Line 1

        result_uint8array[0] = str_uint8array[0]
        result_uint8array[4] = str_uint8array[4]
        result_uint8array[8] = str_uint8array[8]
        result_uint8array[12] = str_uint8array[12]

        // Line 2

        result_uint8array[1] = str_uint8array[5]
        result_uint8array[5] = str_uint8array[9]
        result_uint8array[9] = str_uint8array[13]
        result_uint8array[13] = str_uint8array[1]

        // Line 3

        result_uint8array[2] = str_uint8array[10]
        result_uint8array[6] = str_uint8array[14]
        result_uint8array[10] = str_uint8array[2]
        result_uint8array[14] = str_uint8array[6]

        // Line 4

        result_uint8array[3] = str_uint8array[15]
        result_uint8array[7] = str_uint8array[3]
        result_uint8array[11] = str_uint8array[7]
        result_uint8array[15] = str_uint8array[11]

        return result_uint8array
    }

    // Operation 3. mixColumns

    const mixColumns = str_uint8array => {

        const f2 = u => {

            if (u < 128) {
                u = u * 2
            }

            else {
                u = u * 2 - 256
                u = u ^ 0b00011011
            }

            return u
        }
        const f3 = u => {
            return u ^ (f2(u))
        }

        const c0 = a => {
            return f2(a[0]) ^ f3(a[1]) ^ a[2] ^ a[3]
        }
        const c1 = a => {
            return a[0] ^ f2(a[1]) ^ f3(a[2]) ^ a[3]
        }
        const c2 = a => {
            return a[0] ^ a[1] ^ f2(a[2]) ^ f3(a[3])
        }
        const c3 = a => {
            return f3(a[0]) ^ a[1] ^ a[2] ^ f2(a[3])
        }

        let result_uint8array = new Uint8Array(16)

        result_uint8array[0] = c0(str_uint8array.subarray(0, 4))
        result_uint8array[1] = c1(str_uint8array.subarray(0, 4))
        result_uint8array[2] = c2(str_uint8array.subarray(0, 4))
        result_uint8array[3] = c3(str_uint8array.subarray(0, 4))

        result_uint8array[4] = c0(str_uint8array.subarray(4, 8))
        result_uint8array[5] = c1(str_uint8array.subarray(4, 8))
        result_uint8array[6] = c2(str_uint8array.subarray(4, 8))
        result_uint8array[7] = c3(str_uint8array.subarray(4, 8))

        result_uint8array[8] = c0(str_uint8array.subarray(8, 12))
        result_uint8array[9] = c1(str_uint8array.subarray(8, 12))
        result_uint8array[10] = c2(str_uint8array.subarray(8, 12))
        result_uint8array[11] = c3(str_uint8array.subarray(8, 12))

        result_uint8array[12] = c0(str_uint8array.subarray(12, 16))
        result_uint8array[13] = c1(str_uint8array.subarray(12, 16))
        result_uint8array[14] = c2(str_uint8array.subarray(12, 16))
        result_uint8array[15] = c3(str_uint8array.subarray(12, 16))

        return result_uint8array

    }

    // Operation 4. addRoundKey

    const addRoundKey = (str_uint8array, key_uint8array) => {
        for (let i = 0; i < 16; i++) {
            str_uint8array[i] = str_uint8array[i] ^ key_uint8array[i]
        }
        return str_uint8array
    }

    // Key Expansion Func

    const keyExpand = key_uint8array => {

        let key_uint8array_expand = new Uint8Array(176)

        key_uint8array_expand.set(key_uint8array, 0)

        for (let tot = 16; tot < 176; tot = tot + 4) {



            let idx = tot - 16 * Math.floor(tot / 16)
            let rnm = Math.floor(tot / 16) - 1

            // column 0

            if (idx < 1) {
                let tmp_1 = new Uint8Array(4)
                tmp_1[0] = key_uint8array_expand[tot - 3]
                tmp_1[1] = key_uint8array_expand[tot - 2]
                tmp_1[2] = key_uint8array_expand[tot - 1]
                tmp_1[3] = key_uint8array_expand[tot - 4]
                tmp_1 = subBytes(tmp_1)

                let tmp_2 = key_uint8array_expand.subarray(tot - 16, tot - 12)

                let tmp_3 = new Uint8Array([rcon[rnm], 0, 0, 0])

                let tmp = new Uint8Array(4)

                for (let i = 0; i < 4; i++) {
                    tmp[i] = tmp_1[i] ^ tmp_2[i] ^ tmp_3[i]
                }

                key_uint8array_expand.set(tmp, tot)
            }

            else {
                let tmp_1 = key_uint8array_expand.subarray(tot - 4, tot)
                let tmp_2 = key_uint8array_expand.subarray(tot - 16, tot - 12)

                let tmp = new Uint8Array(4)

                for (let i = 0; i < 4; i++) {
                    tmp[i] = tmp_1[i] ^ tmp_2[i]
                }

                key_uint8array_expand.set(tmp, tot)
            }
        }

        return key_uint8array_expand

    }

    // Init

    const plaintext_length_tmp = plaintext_uint8array_tmp.length
    const key_length_tmp = key_uint8array_tmp.length

    let plaintext_uint8array = null
    let plaintext_length = 0
    let key_uint8array = null

    if (plaintext_length_tmp % 16 === 0) {
        plaintext_uint8array = plaintext_uint8array_tmp
    }
    else {
        plaintext_length = 16 * Math.floor(plaintext_length_tmp / 16) + 16
        plaintext_uint8array = new Uint8Array(plaintext_length)
        plaintext_uint8array.set(plaintext_uint8array_tmp, 0)
        for (i = plaintext_length_tmp; i < plaintext_length; i++) {
            plaintext_uint8array[i] = plaintext_length - plaintext_length_tmp
        }
    }

    if (key_length_tmp > 16) {
        key_uint8array = key_uint8array_tmp.subarray(0, 16)
    }
    else if (key_length_tmp < 16) {
        key_uint8array = new Uint8Array(16)
        key_uint8array.set(key_uint8array_tmp, 0)
        for (let i = key_length_tmp; i < 16; i++) {
            key_uint8array[i] = 16 - key_length_tmp
        }
    }
    else key_uint8array = key_uint8array_tmp

    // Key Expansion

    const key_uint8array_expand = keyExpand(key_uint8array)

    // Main Part

    for (let tot = 0; tot < plaintext_length; tot = tot + 16) {
        let plaintext_par = plaintext_uint8array.subarray(tot, tot + 16)

        plaintext_par = addRoundKey(plaintext_par, key_uint8array)

        for (let i = 1; i <= 9; i++) {
            plaintext_par = subBytes(plaintext_par)
            plaintext_par = shiftRows(plaintext_par)
            plaintext_par = mixColumns(plaintext_par)
            plaintext_par = addRoundKey(plaintext_par, key_uint8array_expand)
        }

        plaintext_par = subBytes(plaintext_par)
        plaintext_par = shiftRows(plaintext_par)
        plaintext_par = addRoundKey(plaintext_par, key_uint8array_expand)

        plaintext_uint8array.set(plaintext_par, tot)
    }

    return plaintext_uint8array

}
