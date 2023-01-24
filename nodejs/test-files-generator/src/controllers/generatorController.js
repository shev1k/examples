const {
  generateMetadata,
  generateReleases,
  getMetadataBuffer,
  getReleaseBuffer,
} = require("../generator");

const generateData = (req, res) => {
  const {
    user,
    releaseCount,
    trackCount,
    storeName,
    releaseName,
    artistName,
    trackName,
  } = req.body;
  const releases = generateReleases({
    user,
    releaseCount,
    trackCount,
    storeName,
    releaseName,
    artistName,
    trackName,
  });
  const metadata = generateMetadata({
    user,
    releases,
    releaseCount,
    trackCount,
  });

  res.json({
    releases,
    metadata,
  });
};

const sendRoyalty = async (req, res) => {
  const { releases } = req.body;
  const buffer = await getReleaseBuffer({ releases });

  res.send(buffer);
};

const sendMetadata = async (req, res) => {
  const { metadata } = req.body;
  const buffer = await getMetadataBuffer({ metadata });

  res.send(buffer);
};

const generatorController = {
  generateData,
  sendMetadata,
  sendRoyalty,
};

module.exports = { generatorController };
