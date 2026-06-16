// back_end/server.js
import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 3005

app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`))
