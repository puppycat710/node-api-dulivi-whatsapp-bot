export const corsOptions = {
	origin: ['http://localhost:3000', 'https://node-api-contatos.onrender.com'], // Domínios permitidos
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}
