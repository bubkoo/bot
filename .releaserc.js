var config = require('@bubkoo/semantic-release-config/config')

module.exports = config({
  npm: {
    npmPublish: false,
    tarballDir: 'lib',
  },
})
