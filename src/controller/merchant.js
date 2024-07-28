const merchantService = require('../services/merchant')

module.exports.calculateRecivables = async ({ params }) => {
    const { id } = params;

    const receivable = await merchantService.findRecivables(id);
    
    return {
        body: receivable,
        statusCode: 200
    }
}