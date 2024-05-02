const slug = require("slug");
const uuid = require("uuid");
const Company = require("../Models/Company");


const slugString = async (c_name) => {
    const uniqueId = uuid.v4();
    const uniqueSevenDigit = uniqueId.replace(/-/g, "").substring(0, 7);
    const uniqueSlag = `${slug(c_name)}-${uniqueSevenDigit}`;

    const length = await Company.countDocuments({slug: uniqueSlag});
    

    if(length !== 0) {
        await slugString()
    }else {
        return uniqueSlag
    }
}

module.exports = slugString