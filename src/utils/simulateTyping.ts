export async function simulateTyping(
  sock: any,
  jid: string,
  delay: number
) {
  await sock.sendPresenceUpdate('composing', jid);
  await new Promise((res) => setTimeout(res, delay));
  await sock.sendPresenceUpdate('paused', jid);
}
