import makeWASocket, {
  Browsers,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { initSocketEvents } from "./events";

export const initWASocket = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.appropriate("Desktop"),
    printQRInTerminal: true,
  });

  initSocketEvents(sock, saveCreds);
};
