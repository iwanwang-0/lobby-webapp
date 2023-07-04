export default function utf8ToHex(utf8String) {
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(utf8String);

  let hexString = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    const byte = utf8Bytes[i];
    const hex = byte.toString(16).padStart(2, '0');
    hexString += hex;
  }

  return `0x${hexString}`;
}

// const utf8String = '你好';
// const hexString = utf8ToHex(utf8String);
// console.log(hexString);
