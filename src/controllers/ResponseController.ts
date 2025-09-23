import axios from 'axios'
import qrcode from 'qrcode'
import { getLatestQrCode } from '../bot/events'
import { getSock } from '../bot/events'

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

class ResponseController {
	// @ts-ignore
	async sendMessage(req, res) {
		const { number, message } = req.body

		if (!number || !message) {
			return res.status(400).json({ error: 'Número e mensagem são obrigatórios.' })
		}

		try {
			const sock = getSock()

			const jid = number.includes('@s.whatsapp.net') ? number : `${number.replace(/\D/g, '')}@s.whatsapp.net`

			const gemini_response = await apiClient.post(`/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
				contents: [
					{
						parts: [{ text: message }],
					},
				],
				safetySettings,
			})

			// Extrai a resposta do texto gerado
			// @ts-ignore
			const generated_text = gemini_response.data.candidates[0].content.parts[0].text

			const response = await sock.sendMessage(jid, { text: generated_text })

			res.status(200).json(response)
		} catch (error: any) {
			console.error(`[Erro Venom Bot] Falha ao enviar mensagem para ${number}:`, error)
			res.status(500).json({ status: error.status, error: 'Não foi possível enviar a mensagem!' })
		}
	}
	// @ts-ignore
	async showQrcode(req, res) {
		const qr = getLatestQrCode()
		if (!qr) {
			return res.status(404).send('QR code ainda não gerado.')
		}

		try {
			const qrImage = await qrcode.toDataURL(qr)
			const html = `
        <html>
          <body style="display:flex;align-items:center;justify-content:center;height:100vh;">
            <img src="${qrImage}" />
          </body>
        </html>
      `
			res.send(html)
		} catch (err) {
			console.log(err)
		}
	}
}

export default new ResponseController()
