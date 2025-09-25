export const encrypt = (param: string): string => {
    const key = reduceTil2Digits(new Date().toLocaleString(
        atob('ZXMtRVM='),
        {
            timeZone: atob('QW1lcmljYS9HdWF0ZW1hbGE='),
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }
    ).split('').map(item => item.charCodeAt(0)).reduce((acc, curr) => acc + curr, 0));

    return encryptAlgorithm(key, toBase64Url(addRandomChar(param, 1)), 0x32);
}

const encryptAlgorithm = (key: number, randomized: string, iterations: number): string => {
    const caracteresASCII: number[] = randomized.split("").map((char) => char.charCodeAt(0));

    for (let i = 0; i < caracteresASCII.length; i++) {
        caracteresASCII[i] += key

        if (caracteresASCII[i] > 0x7e) {
            caracteresASCII[i] = (caracteresASCII[i] - 0x7e) + 0x20;
        }
    }

    if (iterations > 0x1) return encryptAlgorithm(key, String.fromCharCode(...caracteresASCII), iterations - 0x1);

    return toHexString(toBase64Url(String.fromCharCode(...caracteresASCII)));
}

export const reduceTil2Digits = (num: number): number => {
    if (num < 0x14) return num;
    return reduceTil2Digits(num.toString().split('').map(Number).reduce((acc, curr) => acc + curr, 0));
}

export const toBase64Url = (text: string) => {
    return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ' ');
}

export const addRandomChar = (text: string, pos: number) => {
    const chars: string[] = [];

    for (let index = 0; index < text.length; index++) {
        if (index % pos == 0) {
            chars.push(String.fromCharCode(Math.floor(Math.random() * 0x20 + 0x7e)));
        }
        chars.push(text.charAt(index))
    }
    return chars.join('');
}

export const toHexString = (text: string) => {
    return text.split('').map(char => {
        const hex = char.charCodeAt(0).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};