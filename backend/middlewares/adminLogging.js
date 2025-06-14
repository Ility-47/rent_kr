// middleware/adminLogging.js
module.exports = (action) => async (req, res, next) => {
    try {
        const { id: recordId } = req.params;
        const admin = jwt.verify(
            req.headers.authorization.split(' ')[1], 
            process.env.JWT_SECRET
        );
        
        await req.adminPool.query(
            `INSERT INTO admin_logs 
            (admin_username, action, table_name, record_id, action_details)
            VALUES ($1, $2, $3, $4, $5)`,
            [
                admin.username,
                action,
                req.baseUrl.split('/').pop(),
                recordId || null,
                JSON.stringify(req.body) || null
            ]
        );
        
        next();
    } catch (error) {
        console.error('Logging error:', error);
        next(); // Продолжаем даже если логирование не удалось
    }
};