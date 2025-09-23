import qrcode from 'qrcode-terminal'
import { Boom } from '@hapi/boom'
import { DisconnectReason, WASocket, WAMessage } from '@whiskeysockets/baileys'
import { logger } from '../utils/logger'
import { getMessage } from '../utils/message'
import MessageHandler from '../handlers/message'
import { initWASocket } from './socket'

// === Gerenciar QR Code Global ===
let latestQrCode: string | null = null
export const setLatestQrCode = (qr: string) => {
	latestQrCode = qr
}
export const getLatestQrCode = () => {
	return latestQrCode
}
// === Gerenciar Socket Global ===
let sockInstance: WASocket | null = null
export const setSock = (sock: WASocket) => {
	sockInstance = sock
}
export const getSock = (): WASocket => {
	if (!sockInstance) {
		throw new Error('Socket não foi inicializado ainda.')
	}
	return sockInstance
}

let messagesUpsertInitialized = false
// === Eventos do Socket ===
export const initSocketEvents = (sock: WASocket, saveCreds: () => void) => {
	setSock(sock) // salva globalmente aqui

	sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
		logger.info(`Socket Connection Update: ${connection || ''}`)

		switch (connection) {
			case 'close':
				logger.error('Conexão fechada')
				const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

				if (shouldReconnect) {
					logger.info('Reconectando...')
					initWASocket()
				}
				break
			case 'open':
				logger.info('Bot conectado com sucesso.')
				break
		}

		if (qr) {
			setLatestQrCode(qr) // Salva QR para usar no controller
			qrcode.generate(qr, { small: true })
		}
	})

	if (!messagesUpsertInitialized) {
		messagesUpsertInitialized = true

		sock.ev.on('messages.upsert', ({ messages }: { messages: WAMessage[] }) => {
			for (const msg of messages) {
				const isGroup = msg.key.remoteJid?.endsWith('@g.us')
				const isStatus = msg.key.remoteJid === 'status@broadcast'
				if (isGroup || isStatus) return

				const formatted = getMessage(msg)
				if (formatted) {
					// @ts-ignore
					MessageHandler(sock, formatted)
				}
			}
		})
	}

	sock.ev.on('creds.update', saveCreds)
}
