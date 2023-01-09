const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({
    apiKey: 'e7299f110b3540829ee80279e7526851'
});

const handleDetectFace = (req, res) => {
    const imageUrl = req.body.imageUrl;
    const modelName = 'face-detection';
    clarifaiApp.models.predict(modelName, imageUrl)
        .then(data => res.status(200).json(data))
        .catch((err) => res.status(400).json("unable to retrieve data from api"));
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.status(200).json(entries[0].entries))
        .catch(() => res.status(400).json("Unable to get entries"));
}

module.exports = {
    handleImage: handleImage,
    handleDetectFace: handleDetectFace
};