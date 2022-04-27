# vue-shop-admin

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

###[接口文档地址](https://gitee.com/wangCrazy/vueShop-api-server/blob/master/api%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3.md#184-%E7%BC%96%E8%BE%91%E6%8F%90%E4%BA%A4%E5%95%86%E5%93%81)

##### element plus 自动导入   记得在 vue.config.js中填写 不要在webpack.config.js中写
##### 登录页面
首先创建一个 login 分支 切到login分支去开发
```
git checkout -b login
```

#####富文本编辑器 插件  vue3专用      
官方文档:https://vueup.github.io/vue-quill/guide/installation.html#cdn
```
npm install @vueup/vue-quill@beta --save
```
[使用地方](./src/views/goods/Add.vue)

##### 打包移除项目中所有console.log()
npm i babel-plugin-transform-remove-console
在babel.config.js中
```
module.exports = {
  plugins: [
      'transform-remove-console'
  ]
}
```
