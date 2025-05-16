export default {
  plugins: {
    tailwindcss: {
      config: './tailwind.config.js',
    },
    autoprefixer: {},
  },
  cacheInclude: [/.*\.css$/, /.*\.scss$/],
};
