const app = require('./app') // the actual Express applicatio

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})