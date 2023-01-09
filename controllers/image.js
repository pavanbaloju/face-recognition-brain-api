const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key e7299f110b3540829ee80279e7526851");

const handleDetectFace = (req, res) => {
    const imageUrl = req.body.imageUrl;
    stub.PostModelOutputs({
            model_id: "face-detection",
            inputs: [{data: {image: {url: imageUrl}}}]
        },
        metadata,
        (err, data) => {
            if (err) {
                return res.status(400).json("unable to retrieve data from api");
            }
            return res.status(200).json(data);
        }
    );
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