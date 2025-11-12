module.exports = function (eleventyConfig) {
  // Umgebung ermitteln: local oder production
  const env = process.env.ELEVENTY_ENV || "local";
  const siteData = require(`./src/_data/site.${env}.json`);
  eleventyConfig.addGlobalData("site", siteData);

  // Statische Assets direkt durchschleifen
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Pfadpräfix aus Environment lesen (z. B. "preview/feature/xyz")
  const basePath = process.env.BASE_PATH || "";

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    pathPrefix: basePath ? `/${basePath}/` : "/"
  };
};
