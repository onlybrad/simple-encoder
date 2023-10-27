const WINDOWS_1252_MAP = {
    "€": 128,
    "‚": 130,
    "ƒ": 131,
    "„": 132,
    "…": 133,
    "†": 134,
    "‡": 135,
    "ˆ": 136,
    "‰": 137,
    "Š": 138,
    "‹": 139,
    "Œ": 140,
    "Ž": 142,
    "‘": 145,
    "’": 146,
    "“": 147,
    "”": 148,
    "•": 149,
    "–": 150,
    "—": 151,
    "˜": 152,
    "™": 153,
    "š": 154,
    "›": 155,
    "œ": 156,
    "ž": 158,
    "Ÿ": 159,
};
const HEX_MAP = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
};
function isString(str) {
    return typeof str === "string" || str instanceof String;
}
export function typedArrayToUint8Array(typedArray) {
    if (typedArray instanceof Uint8Array) {
        return typedArray;
    }
    return new Uint8Array(typedArray.buffer);
}
export function stringToTypedArray(str, encoding) {
    switch (encoding) {
        case "base2":
        case "binaryString":
            return binaryStringToTypedArray(str);
        case "binary":
        case "latin1":
            return binaryToTypedArray(str);
        case "base16":
        case "hex":
            return hexToTypedArray(str);
        case "base64":
        case "ascii":
            return asciiToTypedArray(str);
        case "base64Url":
        case "asciiUrl":
            return asciiUrlToTypedArray(str);
        case "windows1252":
        case "windows-1252":
            return windows1252ToTypedArray(str);
        case "utf16":
        case "utf-16":
            return utf16ToTypedArray(str);
        case "utf8":
        case "utf-8":
            return new TextEncoder().encode(str);
        default:
            throw new Error(`Encoding ${encoding} not supported.`);
    }
}
export function typedArrayToString(typedArray, encoding) {
    switch (encoding) {
        case "base2":
        case "binaryString":
            return typedArrayToBinaryString(typedArray);
        case "binary":
        case "latin1":
            return typedArrayToBinary(typedArray);
        case "base16":
        case "hex":
            return typedArrayToHex(typedArray);
        case "base64":
        case "ascii":
            return typedArrayToAscii(typedArray);
        case "base64Url":
        case "asciiUrl":
            return typedArrayToAsciiUrl(typedArray);
        case "windows1252":
        case "windows-1252":
            return typedArrayToWindows1252(typedArray);
        case "utf16":
        case "utf-16":
            return typedArrayToUtf16(typedArray);
        case "utf8":
        case "utf-8":
            return typedArrayToUtf8(typedArray);
        default:
            throw new Error(`Encoding ${encoding} not supported.`);
    }
}
export function binaryToTypedArray(binary) {
    const typedArray = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        const code = binary.charCodeAt(i);
        if (code > 255) {
            throw new Error("Invalid binary character : " + binary);
        }
        typedArray[i] = code;
    }
    return typedArray;
}
export const latin1ToTypedArray = binaryToTypedArray;
export function binaryStringToTypedArray(binary) {
    const typedArray = new Uint8Array(Math.ceil(binary.length / 8));
    for (let i = 0; i < typedArray.length; i++) {
        const base10 = Number("0b" + binary.substring(i * 8, i * 8 + 8));
        if (isNaN(base10)) {
            throw new Error("Binary string must only contain 0 or 1");
        }
        typedArray[i] = base10;
    }
    return typedArray;
}
export function hexToTypedArray(hex) {
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    let i = 0;
    for (i; i < bytes.length; i++) {
        const [firstChar, secondChar] = hex.charAt(i * 2 + 1)
            ? [hex.charAt(i * 2), hex.charAt(i * 2 + 1)]
            : ["0", hex.charAt(i * 2)];
        const a = HEX_MAP[firstChar];
        const b = HEX_MAP[secondChar];
        if (a == undefined || b == undefined) {
            throw new Error("Hex must only contain digits and letters a to f");
        }
        bytes[i] = (a << 4) | b;
    }
    return i === bytes.length ? bytes : bytes.slice(0, i);
}
export function asciiToTypedArray(ascii) {
    return new Uint8Array(globalThis.atob(ascii)
        .split("")
        .map((char) => char.charCodeAt(0)));
}
export const base64ToTypedArray = asciiToTypedArray;
export function asciiUrlToTypedArray(asciiUrl) {
    return asciiToTypedArray(asciiUrl
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .replace(/\s/g, ""));
}
export const base64UrlToTypedArray = asciiUrlToTypedArray;
export function windows1252ToTypedArray(string) {
    const typedArray = new Uint8Array(string.length);
    for (let i = 0; i < string.length; i++) {
        if (string.charAt(i) in WINDOWS_1252_MAP) {
            typedArray[i] = WINDOWS_1252_MAP[string.charAt(i)];
        }
        else {
            const code = string.charCodeAt(i);
            if (code > 255) {
                throw new Error("Invalid windows-1252 character: " + string.charAt(i));
            }
            typedArray[i] = code;
        }
    }
    return typedArray;
}
export function utf16ToTypedArray(string) {
    const typedArray = new Uint16Array(string.length);
    for (let i = 0; i < string.length; i++) {
        typedArray[i] = string.charCodeAt(i);
    }
    return new Uint8Array(typedArray.buffer);
}
export function utf8ToTypedArray(string) {
    return new TextEncoder().encode(string);
}
export function typedArrayToBinary(typedArray) {
    typedArray = typedArrayToUint8Array(typedArray);
    return String.fromCharCode(...typedArray);
}
export const typedArrayToLatin1 = typedArrayToBinary;
export function typedArrayToBinaryString(typedArray) {
    typedArray = typedArrayToUint8Array(typedArray);
    return Array.prototype
        .map
        .call(typedArray, (byte) => byte.toString(2).padStart(8, "0"))
        .join("");
}
export function typedArrayToAscii(typedArray) {
    return globalThis.btoa(typedArrayToBinary(typedArray));
}
export const typedArrayToBase64 = typedArrayToAscii;
export function typedArrayToAsciiUrl(typedArray) {
    return typedArrayToAscii(typedArray)
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
export const typedArrayToBase64Url = typedArrayToAsciiUrl;
export function typedArrayToHex(typedArray) {
    typedArray = typedArrayToUint8Array(typedArray);
    return Array.prototype
        .map
        .call(typedArray, (byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}
export function typedArrayToWindows1252(typedArray) {
    typedArray = typedArrayToUint8Array(typedArray);
    return new TextDecoder("windows-1252", { fatal: true }).decode(typedArray);
}
export function typedArrayToUtf16(typedArray) {
    typedArray = typedArrayToUint8Array(typedArray);
    return new TextDecoder("utf-16", { fatal: true }).decode(typedArray);
}
export function typedArrayToUtf8(typedArray) {
    typedArray = typedArrayToUint8Array(typedArray);
    return new TextDecoder("utf-8", { fatal: true }).decode(typedArray);
}
export function convertEncoding(value, encodingSource, encodingOutput) {
    if (isString(value)) {
        return typedArrayToString(stringToTypedArray(value, encodingSource), encodingOutput);
    }
    return stringToTypedArray(typedArrayToString(value, encodingSource), encodingOutput);
}
