import axios from 'axios'
import axiosRetry from 'axios-retry'
import { WASocket } from '@whiskeysockets/baileys'

import { FormattedMessage } from '../utils/message'
import companyInstructions from '../prompts/companyInstructions'
import { getHistory, addToHistory } from '../memory/conversationHistory'
import { splitTextBySentence } from '../utils/splitTextBySentence'
import { simulateTyping } from '../utils/simulateTyping'

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay })

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const apiClient = axios.create({
	baseURL: 'https://generativelanguage.googleapis.com',
})

const safetySettings = [
	{
		category: 'HARM_CATEGORY_HARASSMENT',
		threshold: 'BLOCK_MEDIUM_AND_ABOVE',
	},
	{
		category: 'HARM_CATEGORY_HATE_SPEECH',
		threshold: 'BLOCK_MEDIUM_AND_ABOVE',
	},
	{
		category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
		threshold: 'BLOCK_MEDIUM_AND_ABOVE',
	},
	{
		category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
		threshold: 'BLOCK_MEDIUM_AND_ABOVE',
	},
]

const MessageHandler = async (bot: WASocket, message: FormattedMessage) => {
	// ❌ Ignora mensagens enviadas pelo próprio bot
	if (message.key.fromMe) return

	// ⏳ Aguarda um tempo antes de perguntar pra API
	await delay(1000) // espera 1 segundo (ajustável)

	const userId = message.key.remoteJid!
	addToHistory(userId, 'Usuário', message.content)

	const history = getHistory(userId)
	const fullPrompt = `${companyInstructions}\n\n${history.join('\n')}\nAssistente:`

	try {
		const gemini_response = await apiClient.post(
			`/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
			{
				contents: [
					{
						parts: [{ text: fullPrompt }],
					},
				],
				safetySettings,
			}
		)
		// Extrai a resposta do texto gerado
		const generated_text = gemini_response.data.candidates[0].content.parts[0].text

		const parts = splitTextBySentence(generated_text)
		for (let i = 0; i < parts.length; i++) {
			await simulateTyping(bot, userId, 1000);
			await bot.sendMessage(userId, { text: parts[i] })
			if (i < parts.length - 1) await new Promise((res) => setTimeout(res, 1000))
		}

		//await bot.sendMessage(userId!, { text: generated_text })

		addToHistory(userId, 'Assistente', generated_text)
	} catch (error) {
		// Aqui você pode inclusive mandar uma mensagem tipo "Aguarde um momento..."
		await bot.sendMessage(userId!, {
			text: '🤖 Processando sua mensagem, um instante...',
		})
	}
}

export default MessageHandler
