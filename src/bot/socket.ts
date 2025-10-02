import { makeWASocket, Browsers } from "@whiskeysockets/baileys"
import { initSocketEvents } from "./events"
import { useTursoAuthState } from "../utils/tursoAuth"

export const initWASocket = async () => {
  const { state, saveCreds } = await useTursoAuthState()

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.appropriate("Desktop"),
    printQRInTerminal: false,
  })

  initSocketEvents(sock, saveCreds)
}
