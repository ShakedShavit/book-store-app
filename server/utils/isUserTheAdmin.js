const isUserTheAdmin = (email) => {
    if (email === process.env.ADMIN_EMAIL) return true;
    return false;
}

module.exports = isUserTheAdmin;