const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const serve = require('koa-static')
const views = require('koa-views')
const bodyparser = require('koa-bodyparser')

/* 静态资源引用 */
const main = serve(path.join(__dirname))
app.use(main)

/* 路由 */
// 获取渲染文件
router.use(views(path.resolve(__dirname, './view'), {
  map: {html: 'ejs'}
}))
router.get('/', async (ctx) => {
  await ctx.render('index', {title: 'hello koa2'})
}).get('/about', async (ctx) => {
  await ctx.render('about')
}).get('/404', async (ctx) => {
  await ctx.render('404')
}).get('*', async (ctx) => {
  // 重定向
  await ctx.response.redirect('/404')
})
// 500
const error500 = ctx => {
  ctx.throw(500)
}
// 404
const error404 = ctx => {
  ctx.throw(404)
}
app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(error500)
  .use(error404)

// 配置ctx.body解析中间件
app.use(bodyparser())

// 服务监控
app.listen(3000, () => {
  console.log('OK!!!')
})