import express from 'express'
import responseController from '../controllers/ResponseController'

const router = express.Router()

router.post('/api/whatsapp/send', responseController.sendMessage)
router.get('/api/whatsapp/qrcode', responseController.showQrcode)

export default router
