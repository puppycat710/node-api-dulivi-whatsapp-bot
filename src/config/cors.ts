export const corsOptions = {
	origin: ['http://localhost:3000', 'https://node-api-contatos.onrender.com', 'https://node-api-dulivi-whatsapp-bot.vercel.app/'], // Domínios permitidos
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}
