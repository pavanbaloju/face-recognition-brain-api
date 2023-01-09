const handleRegister = (req, res, bcrypt, db) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json("incorrect form submission");
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmails => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmails[0].email,
                        name: name,
                        joined: new Date(),
                    })
                    .then(users => res.status(200).json(users[0]));
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
        .catch(() => res.status(400).json("unable to register"));
}

module.exports = {
    handleRegister: handleRegister
};