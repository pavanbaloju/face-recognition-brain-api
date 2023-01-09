const handleUsers = (res, db) => {
    db.select('*')
    .from('users')
    .then(users => res.status(200).json(users))
    .catch(() => res.status(400).json("Something went wrong"));
}
module.exports = {
    handleUsers: handleUsers
};