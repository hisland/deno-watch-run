## 配置 webhook

1. 打开 https://deno.land/x 点击 **Publish a module** 得到一个 webhook 链接
2. 打开 git 仓库, Settings 里面的 Webhooks 添加

# 发版
1. 修改代码并 commit
2. 打 tag `git tag v0.0.x`
3. push tag `git push origin --tags`

查看 source 使用 watch-*.ts 使用
