export const corsOptions = {
	origin: ['http://localhost:3000', 'https://node-api-dulivi-whatsapp-bot-production.up.railway.app'], // Domínios permitidos
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}
