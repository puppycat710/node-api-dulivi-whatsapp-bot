import { createClient } from '@libsql/client'
import { TURSO_DATABASE_URL } from '../config/env.js'
import { TURSO_AUTH_TOKEN } from '../config/env.js'

let turso:any = null

export const getTursoClient = () => {
  if (!turso) {
    const databaseUrl = TURSO_DATABASE_URL
    const authToken = TURSO_AUTH_TOKEN

    if (!databaseUrl || !authToken) {
      throw new Error('❌ TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN não configurados.')
    }

    turso = createClient({
      // url: 'file:local.db',
      // syncUrl: databaseUrl,
      url: databaseUrl,
      authToken,
      syncInterval: 60000, // sincroniza a cada 60s
    })

    console.log('✅ Cliente Turso inicializado.')
  }

  return turso
}
