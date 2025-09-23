import {
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { initSocketEvents } from "./events";

export const initWASocket = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    browser: ['Bot', 'Chrome', '1.0.0'],
    printQRInTerminal: true
  });

  initSocketEvents(sock, saveCreds);
};
