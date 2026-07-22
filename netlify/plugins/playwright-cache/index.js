const CACHE_PATH = `${process.env.HOME}/.cache/ms-playwright`;

module.exports = {
  onPreBuild: async ({ utils }) => {
    const restored = await utils.cache.restore(CACHE_PATH);
    if (!restored) {
      console.log('No cached Playwright browsers found, downloading during build.');
    }
  },
  onPostBuild: async ({ utils }) => {
    await utils.cache.save(CACHE_PATH);
  },
};
