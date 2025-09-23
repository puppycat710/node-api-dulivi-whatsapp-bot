import app from './app'
import { initWASocket } from './bot/socket'

const PORT = process.env.PORT || 3000

// Inicia o servidor imediatamente
app.listen(PORT, async () => {
	console.log(`🚀 API rodando na porta ${PORT}`)
	try {
		await initWASocket()
	} catch (err) {
		console.error('Erro ao iniciar o bot:', err)
	}
})
