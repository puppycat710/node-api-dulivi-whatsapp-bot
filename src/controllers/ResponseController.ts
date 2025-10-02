import qrcode from 'qrcode'

import { getLatestQrCode } from '../bot/events'
import { getSock } from '../bot/events'

import { formatJid } from '../utils/formatJid'

class ResponseController {
	// @ts-ignore
	async sendMessage(req, res) {
		const { number, message } = req.body

		if (!number || !message) {
			return res.status(400).json({ error: 'Número e mensagem são obrigatórios.' })
		}

		try {
			const sock = getSock()

			const jid = await formatJid(number)

			const response = await sock.sendMessage(jid, { text: message })

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
