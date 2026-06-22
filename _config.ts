import lume from "lume/mod.ts";
import metas from "lume/plugins/metas.ts";
import nav from "lume/plugins/nav.ts";
import robots from "lume/plugins/robots.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import sitemap from "lume/plugins/sitemap.ts";
import gzip from "lume/plugins/gzip.ts";
import esbuild from "lume/plugins/esbuild.ts";

const site = lume({
  location: new URL("https://github.com/feriekolonien/web"),
});

// Global variable for registration opening time
site.data("openForRegistrationAt", "2025-12-24T12:00:00+01:00");
site.data("registrationDeadlineAt", "2026-06-01T23:59:59+02:00");

site.add("/assets");
site.add("./favicon.ico");

site.use(metas());
site.use(nav());
site.use(robots());
site.use(esbuild({
  extensions: [".jsx"],
  denoConfig: "_tournament/deno.json",
  options: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
}));
site.use(tailwindcss());
site.use(sitemap());
site.use(gzip());

export default site;
