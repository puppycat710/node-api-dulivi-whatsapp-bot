import { makeWASocket, Browsers, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { initSocketEvents } from './events'

export const initWASocket = async () => {
	const { state, saveCreds } = await useMultiFileAuthState('./auth')

	const sock = makeWASocket({
		auth: state,
		// browser: ['Bot', 'Chrome', '1.0.0'],
		browser: Browsers.appropriate("Desktop"),
		printQRInTerminal: false,
	})

	initSocketEvents(sock, saveCreds)
}
