async function fetchAlbums() {
  // Updated query to include all images for individual albums
  const query = `*[_type == "album" && title != "Historie"] | order(title desc)
    {
      title,
      coverImage {asset -> {...}},
      images[] {
        asset -> {...},
        alt,
        "metadata": asset->metadata
      }
    }`;

  const SANITY_PROJECT_ID = "bvwemm0b";
  const SANITY_DATASET = "production";
  const SANITY_API_VERSION = "2025-10-11";

  console.log("🔍 Fetching albums with all images...");

  try {
    const response = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${
        encodeURIComponent(query)
      }`,
    );

    const data = await response.json();

    if (!data.result || !data.result.length) {
      throw new Error("No albums found in Sanity");
    }

    return data.result;
  } catch (error) {
    console.error("❌ Failed to fetch albums:", error);
    return [];
  }
}

export const albums = await fetchAlbums();
