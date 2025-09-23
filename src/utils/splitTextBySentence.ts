// ▶️ Emoji na mesma linha
export function splitTextBySentence(text: string): string[] {
	return text.match(/[^.!?]+[.!?]+(?:\s+(?![.!?\s])|$)/g)?.map((s) => s.trim()) ?? [text]
}
//↪️ Emoji na próxima linha
// export function splitTextBySentence(text: string): string[] {
// 	const result: string[] = []
// 	const regex = /([^.!?]+[.!?])([\s\p{Emoji_Presentation}\p{Extended_Pictographic}]*)/gu

// 	let match
// 	while ((match = regex.exec(text)) !== null) {
// 		const sentence = match[1].trim()
// 		const tail = match[2].trim()

// 		if (sentence) result.push(sentence)
// 		if (tail) result.push(tail)
// 	}

// 	return result.length ? result : [text]
// }
