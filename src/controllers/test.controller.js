const { response } = require("../utils/response")

exports.test = async (req,res) => {
    return response(res);
}