const express = require('express')
function socketRouter(io) {
    const router = express.Router();
    router.get('/forecast', (req, res) => {
        const count = req.query.count;
        if (count) {
            res.json({ forecast: count })
        } else {
            io.emit('mod_forecast', count);
        }
    });
    return router
}

module.exports = socketRouter;