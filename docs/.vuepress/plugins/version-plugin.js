const { version } = require('../configs/meta');

module.exports = () => ({
  name: 'version-plugin',
  extendsMarkdown: (md) => {
    const render = md.render;
    md.render = function (src, env) {
      // 简单替换 ${version} 标记为实际版本号
      src = src.replace(/\$\{version\}/g, version);
      return render.call(this, src, env);
    };
  }
});
