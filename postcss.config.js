module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-parent-selector')({ selector: '.prompster' })
  ],
};
