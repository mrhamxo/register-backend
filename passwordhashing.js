// password hashing practice
const bcrypt = require('bcrypt');
const securePassword = async(password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const passwordHashMatched = await bcrypt.compare("hamza@123", passwordHash);
    console.log(passwordHashMatched);
}
securePassword("hamza@12");
