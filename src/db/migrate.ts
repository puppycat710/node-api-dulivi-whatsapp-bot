import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { getTursoClient } from '../lib/turso'

export const migrate = async () => {
	const turso = getTursoClient()
	console.log('🧩 Rodando migrações...')
	const dir = path.join(process.cwd(), 'src/db/migrations')
	const files = readdirSync(dir).sort()

	// Cria a tabela migrations se não existir
	await turso.execute(`
		CREATE TABLE IF NOT EXISTS migrations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE NOT NULL,
			run_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);
	`)

	// Agora pode buscar migrações aplicadas
	const appliedMigrations = await turso.execute('SELECT name FROM migrations')
	const applied = appliedMigrations.rows.map((row:any) => row.name)

	for (const file of files) {
		if (applied.includes(file)) {
			console.log(`⏩ Pulando: ${file}`)
			continue
		}

		const sql = readFileSync(path.join(dir, file), 'utf-8')
		console.log(`🔄 Executando: ${file}`)

		try {
			await turso.execute(sql)
			await turso.execute(`INSERT INTO migrations (name) VALUES (?)`, [file])
			console.log(`✅ ${file} executado com sucesso.`)
		} catch (err) {
			console.error(`❌ Erro ao executar ${file}:`, err.message)
			break
		}
	}
}
