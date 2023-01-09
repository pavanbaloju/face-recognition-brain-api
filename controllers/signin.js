const handleSignIn = (req, res, bcrypt, db) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("incorrect form submission");
    }
    db.select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                db.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(users => res.status(200).json(users[0]))
                    .catch(() => res.status(400).json("unable to find user"))
            }
            else {
                res.status(404).json("wrong credentials");
            }
        })
        .catch(() => res.status(404).json("wrong credentials"));
}

module.exports = {
    handleSignIn: handleSignIn
}