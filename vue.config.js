const mode = process.env.NODE_ENV;

module.exports = {
    lintOnSave: false,
    publicPath: mode === 'production' ? '/shl/mule' : '/'
}
