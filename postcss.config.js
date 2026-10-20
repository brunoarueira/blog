import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'
import stylelint from 'stylelint'

export default {
  plugins: [
    postcssImport({
      plugins: [stylelint],
    }),
    postcssPresetEnv({
      autoprefixer: { grid: false },
      features: {
        'nesting-rules': true,
        // Tailwind v4 relies on native cascade layers (@layer base/utilities).
        // The polyfill flattens them into :not(#\#) specificity hacks, which
        // lets preflight resets override our own styles.
        'cascade-layers': false,
      },
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
    }),
  ]
}
