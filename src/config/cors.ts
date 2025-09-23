export const corsOptions = {
	origin: ['http://localhost:3001', 'https://whatsapp-restaurant-bot.fly.dev'], // Domínios permitidos
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}
