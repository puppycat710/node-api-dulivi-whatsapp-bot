import { proto, initAuthCreds, BufferJSON, AuthenticationState } from "@whiskeysockets/baileys"
import { getTursoClient } from '../lib/turso'
const turso = getTursoClient()
getTursoClient
const AUTH_TABLE = "auth"

// garante tabela criada
export async function ensureAuthTable() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS ${AUTH_TABLE} (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )
  `)
}

async function getEntry(id: string) {
  const res = await turso.execute(
    `SELECT data FROM ${AUTH_TABLE} WHERE id = ?`,
    [id]
  )
  return res.rows.length ? JSON.parse(res.rows[0].data as string, BufferJSON.reviver) : null
}

async function setEntry(id: string, data: any) {
  await turso.execute(
    `INSERT OR REPLACE INTO ${AUTH_TABLE} (id, data) VALUES (?, ?)`,
    [id, JSON.stringify(data, BufferJSON.replacer)]
  )
}

export async function useTursoAuthState(): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> {
  await ensureAuthTable()

  let creds = await getEntry("creds")
  if (!creds) {
    creds = initAuthCreds()
    await setEntry("creds", creds)
  }

  const state: AuthenticationState = {
    creds,
    keys: {
      get: async (type, ids) => {
        const data: { [key: string]: any } = {}
        for (const id of ids) {
          const value = await getEntry(`${type}-${id}`)
          if (value) data[id] = value
        }
        return data
      },
      set: async (data) => {
        for (const [category, ids] of Object.entries(data)) {
          for (const [id, value] of Object.entries(ids)) {
            await setEntry(`${category}-${id}`, value)
          }
        }
      },
    },
  }

  const saveCreds = async () => {
    await setEntry("creds", state.creds)
  }

  return { state, saveCreds }
}
