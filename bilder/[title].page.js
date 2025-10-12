import { albums } from "./_data.ts";

export const layout = "base.vto";

export default function* () {
  for (const album of albums) {
    // Create a slug from the title
    const slug = album.title.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    yield {
      url: `/bilder/${slug}/`,
      title: `Album: ${album.title}`,
      albumTitle: album.title,
      album: album,
      layout: "album.vto",
    };
  }
}
