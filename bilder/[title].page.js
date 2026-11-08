import { albums } from "./_data.ts";

export const layout = "base.vto";

function slugify(text) {
  return text.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

// An album is rendered as a list of sections: one per group (e.g. "1. parti"),
// followed by any ungrouped images. Older albums only have ungrouped images,
// which then become a single untitled section.
function toSections(album) {
  const sections = (album.groups || [])
    .filter((group) => group.images?.length)
    .map((group) => ({
      title: group.title,
      id: slugify(group.title || group._key),
      images: group.images,
    }));

  if (album.images?.length) {
    sections.push({
      title: sections.length ? "Flere bilder" : null,
      id: "flere-bilder",
      images: album.images,
    });
  }

  return sections;
}

export default function* () {
  for (const album of albums) {
    yield {
      url: `/bilder/${slugify(album.title)}/`,
      title: `Album: ${album.title}`,
      albumTitle: album.title,
      album: album,
      sections: toSections(album),
      layout: "album.vto",
    };
  }
}
