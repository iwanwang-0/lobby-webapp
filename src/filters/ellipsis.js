export default function ellipsisAddress(address) {
  return address.replace(/^(.{6}).*(.{6})$/, '$1...$2');
}
