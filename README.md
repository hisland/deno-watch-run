# 配置 webhook

1. 打开 https://deno.land/x 点击 **Publish a module** 得到一个 webhook 链接
2. 打开 git 仓库, Settings 里面的 Webhooks 添加

# 开发

开发的时候, 执行 deno run -A watch-xxx.ts 运行

# 发版
1. 修改代码并 commit
2. 打 tag `git tag v0.0.x`
3. push tag `git push origin --tags`

查看 source 使用 watch-*.ts 使用

# 用 nodejs 监听 js 文件变更并执行

1. 安装 `deno install -rqfA https://deno.land/x/deno_watch_run/watch-run-nodejs.ts`
1. shell 进行目录
2. 执行 watch-run-nodejs .
3. 修改这个目录里面的任意 js 文件, 查看控制台输出

# 用 deno 监听 js/ts 文件变更并执行

1. 安装 `deno install -rqfA https://deno.land/x/deno_watch_run/watch-run-js-ts.ts`
1. shell 进行目录
2. 执行 watch-run-js-ts .
3. 修改这个目录里面的任意 js/ts 文件, 查看控制台输出

# 保存 yaml/yml 输出 json

1. 安装 `deno install -rqfA https://deno.land/x/deno_watch_run/watch-yaml-to-json.ts`
1. shell 进行目录
2. 执行 watch-yaml-to-json .
3. 修改这个目录里面的任意 yaml/yml 文件, 查看控制台输出

