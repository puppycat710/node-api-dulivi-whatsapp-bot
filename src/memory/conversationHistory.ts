const conversationHistory = new Map<string, string[]>()

export const getHistory = (userId: string) => {
	return conversationHistory.get(userId) || []
}

export const addToHistory = (userId: string, role: 'Usuário' | 'Assistente', text: string) => {
	const history = conversationHistory.get(userId) || []
	history.push(`${role}: ${text}`)
	conversationHistory.set(userId, history.slice(-10)) // guarda só as últimas 10 interações
}
