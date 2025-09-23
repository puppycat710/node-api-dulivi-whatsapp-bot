import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { initSocketEvents } from './events'

let socketInitialized = false

export const initWASocket = async () => {
	if (socketInitialized) return // já inicializado, não faz nada
	socketInitialized = true

	const { state, saveCreds } = await useMultiFileAuthState('/opt/render/data/auth')

	const sock = makeWASocket({
		auth: state,
		browser: ['Bot', 'Chrome', '1.0.0'],
		printQRInTerminal: true,
	})

	initSocketEvents(sock, saveCreds)
}
