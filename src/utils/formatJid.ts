export async function formatJid(number: string) {
	// remove tudo que não é número
	let onlyNumbers = number.replace(/\D/g, '')

	// se não começar com 55, adiciona
	if (!onlyNumbers.startsWith('55')) {
		onlyNumbers = '55' + onlyNumbers
	}

	return `${onlyNumbers}@s.whatsapp.net`
}


