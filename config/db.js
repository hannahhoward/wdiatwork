module.exports = {
  test: {
    url: 'mongodb://localhost/wdiatwork_test'
  },
  development: {
    url: 'mongodb://localhost/wdiatwork_dev'
  },
  production: {
    url: process.env['MONGOHQ_URL']
  }
}