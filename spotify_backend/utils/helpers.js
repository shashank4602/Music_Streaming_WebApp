const jwt = require("jsonwebtoken");
async function getToken(email, user) {
    const token = jwt.sign(
        { identifier: user._id },
        "thisKeyIsSupposedToBeSecret");
    return token;
};
//module.exports = getToken; -> is wrong
module.exports = { getToken };

//2
// const getToken = (email, user) => {
//     const token = jwt.sign(
//         { identifier: user._id },
//         "thisKeyIsSupposedToBeSecret");
//     return token;
// };
// module.exports = { getToken };