const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Umgebung ermitteln: local oder production
  const env = process.env.ELEVENTY_ENV || "local";
  const siteData = require(`./src/_data/site.${env}.json`);
  eleventyConfig.addGlobalData("site", siteData);

  // Git-basiertes lastModified
  eleventyConfig.addFilter("lastModified", (inputPath) => {
    try {
      // Eleventy gibt hier oft einen absoluten Pfad – wir brauchen ihn relativ zum Repo-Root
      const relPath = path.relative(process.cwd(), inputPath);

      if (!fs.existsSync(relPath)) {
        return null;
      }

      // Letzten Commit-Zeitpunkt für diese Datei holen (ISO 8601)
      const result = execSync(
        `git log -1 --format=%cI -- "${relPath}"`,
        { encoding: "utf-8" }
      ).trim();

      if (!result) return null;

      // Nur das Datum (YYYY-MM-DD)
      return result.slice(0, 10);
    } catch (e) {
      return null;
    }
  });

  // JSON-LD schön formatiert ausgeben
  eleventyConfig.addFilter("json", (obj) => {
    try {
      return JSON.stringify(obj, null, 2); // << sauber formatiert
    } catch (e) {
      return "{}"; // Fallback, falls etwas völlig Unerwartetes passiert
    }
  });

  // Statische Assets direkt durchschleifen
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk"
  };
};
