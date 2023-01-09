const handleProfile = (req, res, db) => {
    const { id } = req.params;
    db.select('*')
        .from('users')
        .where({ id: id })
        .then(users => {
            if (users.length) {
                return res.status(200).json(users[0]);
            } else {
                return res.status(404).json("User not found");
            }
        });
}

module.exports = {
    handleProfile: handleProfile
}