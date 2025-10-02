import app from './app'
import { initializeDatabase } from './db/db'
import { initWASocket } from './bot/socket'

const PORT = process.env.PORT || 3000

initializeDatabase()
	.then(async () => {
		console.log('Banco de dados pronto!')

		app.listen(PORT, async () => {
			console.log(`🚀 API rodando na porta ${PORT}`)
			try {
				await initWASocket()
			} catch (err) {
				console.error('Erro ao iniciar o bot:', err)
			}
		})
	})
	.catch((err) => {
		console.error('Erro ao inicializar banco:', err)
		process.exit(1)
	})
