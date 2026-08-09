const aiService = require('../services/aiServices');

exports.reviewCode = async(req,res)=>{
    try{
        const {code} = req.body;

        if(!code){
            return res.status(400).json({
                message: 'Code not found'
            });
        }

        const result = await aiService.reviewCode(code);

        res.status(200).json(result);
    }catch(error){
        res.status(500).json({
            error: error.message
        });
    }
};