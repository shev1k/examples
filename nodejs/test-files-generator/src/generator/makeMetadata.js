const XLSX = require("xlsx");

const generateMetadata = ({
  releases: initialReleases,
  user,
  releaseCount,
  trackCount,
}) => {
  const metadatas = [];

  const releases = Object.values(
    initialReleases.reduce((acc, release) => {
      acc[release.isrc] = release;
      return acc;
    }, {})
  );

  for (let i = 0; i < releases.length; i++) {
    const release = releases[i];
    const metadata = {
      isrc: release.isrc,
      album_format: "Single",
      c_line: "C Line Records",
      c_year: "2022",
      cat_no: release.isrc,
      display_artist: release.display_artist,
      ean13: release.upc,
      email: user,
      isrc_1: release.isrc,
      label_name: "Label name",
      p_line: "C Line Records",
      p_year: "2022",
      product_title: release.release,
      release_launch: 44092,
      track_display_artist: release.display_artist,
      track_no: (i % trackCount) + 1,
      track_p_line: "C Line Records",
      track_p_year: "2022",
      track_title: release.track,
      version: "",
      track_version: "",
    };
    metadatas.push(metadata);
  }

  return metadatas;
};

const getMetadataBuffer = async ({ metadata }) => {
  const workSheet = XLSX.utils.json_to_sheet(metadata);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "metadata");
  return await XLSX.write(workBook, {
    bookType: "xlsx",
    type: "buffer",
  });
};

module.exports = { generateMetadata, getMetadataBuffer };
