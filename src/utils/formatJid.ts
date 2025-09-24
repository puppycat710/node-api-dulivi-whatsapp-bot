export function formatJid(number: string) {
  // mantém só dígitos
  let onlyNumbers = number.replace(/\D/g, '')

  // se não começar com 55, adiciona
  if (!onlyNumbers.startsWith('55')) {
    onlyNumbers = '55' + onlyNumbers
  }

  return `${onlyNumbers}@s.whatsapp.net`
}
