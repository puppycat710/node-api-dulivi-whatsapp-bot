import { createClient } from 'redis'

const client = createClient({
	url: 'rediss://default:ASWcAAImcDI2ZDM3NjdjYTQ1ZTc0ZWMxYjQ3MDgxYWViMWIzYzA3MXAyOTYyOA@central-gecko-9628.upstash.io:6379',
})

client.on('error', (err: any) => {
	console.error('Erro ao conectar no Redis:', err)
})

// Exporta uma função para garantir conexão única
let isConnected = false

export async function getRedisClient() {
	if (!isConnected) {
		await client.connect()
		isConnected = true
	}
	return client
}
