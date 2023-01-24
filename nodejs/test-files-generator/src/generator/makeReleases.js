const R = require("ramda");
const csv = require("fast-csv");

const toISO = (date) => String(new Date(date).toISOString());

const headers = [
  "start_date",
  "end_date",
  "country",
  "currency",
  "type",
  "units",
  "unit_price",
  "gross_total",
  "channel_costs",
  "taxes",
  "net_total",
  "currency_rate",
  "gross_total_client_currency",
  "other_costs_client_currency",
  "channel_costs_client_currency",
  "taxes_client_currency",
  "net_total_client_currency",
  "user",
  "channel",
  "label",
  "display_artist",
  "release",
  "upc",
  "track",
  "isrc",
];

const getRandomNumber = (length) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);
  return Math.floor(Math.random() * (max - min) + min);
};

const generateReleases = ({
  user,
  releaseCount = 5,
  trackCount = 5,
  storeName = "channel",
  artistName = "artist",
  releaseName = "release",
  trackName = "track",
}) => {
  console.log({
    user,
    releaseCount,
    trackCount,
    storeName,
    artistName,
    releaseName,
    trackName,
  });
  const releasesWithoutTracks = [];

  const country = "Ukraine";
  const currency = "UAH";
  const type = "t";
  const units = "100";
  const unit_price = "0.016651000000";
  const gross_total = "0.033302000000";
  const channel_costs = "0.000000000000";
  const taxes = "0.000000000000";
  const net_total = "0.033302000000";
  const currency_rate = "56.2501248099123200";
  const gross_total_client_currency = "1.873241664660";
  const other_costs_client_currency = "0.000000000000";
  const channel_costs_client_currency = "0.000000000000";
  const taxes_client_currency = "0.000000000000";
  const net_total_client_currency = "1.873241664660";
  const start_date = new Date();
  const end_date = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < releaseCount; i++) {
    const release = {
      id: i,
      start_date: toISO(start_date),
      end_date: toISO(end_date),
      upc: String(getRandomNumber(13)),
      label: "Single Track Studios",
      release: `${releaseName}_${i}`,
      channel: storeName + "_" + i,
      user,
      country,
      currency,
      type,
      units,
      unit_price,
      gross_total,
      channel_costs,
      taxes,
      net_total,
      currency_rate,
      gross_total_client_currency,
      other_costs_client_currency,
      channel_costs_client_currency,
      taxes_client_currency,
      net_total_client_currency,
    };

    releasesWithoutTracks.push(release);
    start_date.setMonth(start_date.getMonth() - 1);
    end_date.setMonth(end_date.getMonth() - 1);
  }

  const releases = [];

  for (let i = 0; i < releaseCount; i++) {
    const release = releasesWithoutTracks[i];

    for (let j = 0; j < trackCount; j++) {
      releases.push({
        ...release,
        isrc: "INS" + getRandomNumber(9),
        display_artist: `${artistName}_${i}_${j}`,
        track: `${trackName}_${i}_${j}`,
      });
    }
  }

  const result = [...releases];

  for (let i = 0; i < releases.length; i++) {
    const release = releases[i];
    const start_date = new Date(release.start_date);
    const end_date = new Date(release.end_date);

    start_date.setFullYear(start_date.getFullYear() - 2);
    end_date.setFullYear(end_date.getFullYear() - 2);

    result.push({
      ...release,
      start_date: toISO(start_date),
      end_date: toISO(end_date),
    });
  }

  return result;
};

const getReleaseBuffer = async ({ releases }) => {
  const data = releases.map(R.omit(["id"]));

  return await csv.writeToBuffer(data, {
    headers,
  });
};

module.exports = { generateReleases, getReleaseBuffer };
