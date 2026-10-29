# FenggangHuang.github.io
# 个人花园 · GitHub Pages 个人主页

一个以「彭于晏」为展示昵称的互动个人网站。奶油色与植物绿搭配原创 SVG 花园插画，通过数鸭子、树苗长高、天平配重等六个小游戏介绍自己。适配手机，探索进度保存在访问者浏览器中。夸张运动成绩为趣味自述，不是经核实的竞技纪录。

- 目标网站：<https://FenggangHuang.github.io/>
- 目标公开仓库：<https://github.com/FenggangHuang/FenggangHuang.github.io>
- 当前状态：已准备本地文件；尚未完成 GitHub 仓库创建、推送及在线部署验证。

## 本地预览

直接用浏览器打开 `index.html`，或在本目录运行：

```sh
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。不需要安装前端依赖。Google Fonts 加载失败时会回退到系统字体。

## 文件

```text
index.html   # 网页入口，必须放在公开仓库根目录
style.css    # 样式与动画
app.js       # 互动、资料解锁与本地进度保存
.nojekyll    # 直接发布静态文件，不使用 Jekyll
README.md    # 预览说明与发布步骤
```

## 发布到 GitHub Pages

根据 [GitHub Pages 官方快速入门](https://docs.github.com/en/pages/quickstart)：

1. 自行在 GitHub 登录，确认用户名为 `FenggangHuang`；不要向 AI 提供密码、验证码或令牌。
2. 创建与私有练习仓库分开的 **Public** 仓库，名称必须为 `FenggangHuang.github.io`（不带尖括号）。如该仓库已存在，先检查原有内容，不要直接覆盖。
3. 在新仓库根目录上传本文件夹里的 `index.html`、`style.css`、`app.js`、`README.md`。可以通过 GitHub 的 **Add file → Upload files** 上传。不要上传外层 `github_homepage` 文件夹本身，否则入口不在仓库根目录。
4. 将 `.nojekyll` 也放在公开仓库根目录；如果文件选择器隐藏了它，可通过 **Add file → Create new file** 创建，内容留空或写一行注释。
5. 提交到 `main`，进入 **Settings → Pages**：Source 选 **Deploy from a branch**，Branch 选 **main**，目录选 **/(root)**，点击 **Save**。
6. 等待部署（官方说明最多可能需要约 10 分钟），访问 <https://FenggangHuang.github.io/>。确认看到个人花园网页而不只是 README；再检查下滚按钮与年龄解锁是否正常。
7. 部署成功后，更新本 README 的「当前状态」，并在作业要求的私有练习仓库中提交 `github_homepage/` 整个目录作为站点副本。此环境的当前目录并非 Git 仓库，因此本地文件准备不代表已完成 Git 提交。

## 公开前检查

只公开以上五个站点文件，不上传父目录、学号命名文件、私人作业、凭证或本地配置。小游戏只提供趣味互动，不是隐私保护：写在前端代码中的资料可以被访问者直接查看。如果有不想公开的信息，必须先从 HTML / JavaScript 中删除，不能只靠「解锁」隐藏。

