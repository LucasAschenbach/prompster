module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-prefix-selector')({
      prefix: '.prompster',
      exclude: ['.prompster'],
      transform(prefix, selector, prefixedSelector) {
        if (
          selector.startsWith('@') ||
          selector.startsWith('html') ||
          selector.startsWith('body') ||
          selector.startsWith(':root')
        ) {
          return prefixedSelector.replace(
            /^\.prompster\s+(html|body|:root)/,
            prefix
          );
        }

        return prefixedSelector;
      },
    })
  ],
};
