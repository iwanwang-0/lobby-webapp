export default function hexToUtf8(hex) {
  const bytes = [];

  for (let i = 0; i < hex.length; i += 2) {
    const hexByte = hex.substr(i, 2);
    const byte = parseInt(hexByte, 16);
    bytes.push(byte);
  }

  const utf8String = new TextDecoder('utf-8').decode(new Uint8Array(bytes));
  return utf8String;
}
