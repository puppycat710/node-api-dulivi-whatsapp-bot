import makeWASocket, {
  Browsers,
  useMultiFileAuthState,
} from "baileys";
import { initSocketEvents } from "./events";

export const initWASocket = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.appropriate("Desktop"),
    printQRInTerminal: false,
  });

  initSocketEvents(sock, saveCreds);
};
