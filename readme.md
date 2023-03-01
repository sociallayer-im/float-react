### 安装依赖
```shell
yarn install
```

###  发布
```shell
yarn build
yarn zip
```
将会在项目根目录生成Float.zip文件,把文件并上传chrome应用商店。

### 开发
```shell
yarn build
yarn watch
```
- Step1 Edge在浏览器地址栏输入edge://extensions/ ,Chrome在地址栏输入edge://extensions/进入插件管理页面
- Step2 点击“加载加压缩的插件”,页面列表里出现加载的插件
- Step3 修改代码后等待自动编译完成
- Step4 在浏览器插件管理页面点击‘重新加载’后查看修改效果

