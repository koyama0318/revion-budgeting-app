import { FakeHandler } from 'revion'
import { category, categoryQuerySource, categoryReactor } from './features/category'
import { expense, expenseQuerySource, expenseReactor } from './features/expense'
import { income, incomeQuerySource, incomeReactor } from './features/income'
import { monthlyReportQuerySource } from './features/monthly-report/monthly-report-query-resolver'

const handler = new FakeHandler({
  aggregates: [income, expense, category],
  reactors: [incomeReactor, expenseReactor, categoryReactor],
  querySources: [
    incomeQuerySource,
    expenseQuerySource,
    categoryQuerySource,
    monthlyReportQuerySource
  ]
})

async function handleCommand(request: Request): Promise<Response> {
  const body = await request.json()

  const result = await handler.command(body as Parameters<typeof handler.command>[0])
  if (result.ok) {
    return new Response(JSON.stringify({ success: true, data: result.value }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ success: false, error: result.error }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  })
}

async function handleQuery(request: Request): Promise<Response> {
  const body = await request.json()

  const result = await handler.query(body as Parameters<typeof handler.query>[0])

  if (result.ok) {
    return new Response(JSON.stringify({ success: true, data: result.value }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ success: false, error: result.error }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  })
}

// サーバーのメイン処理
const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname === '/command') {
      const res = await handleCommand(request)
      handler.log()
      return res
    }

    if (request.method === 'POST' && url.pathname === '/query') {
      const res = await handleQuery(request)
      handler.log()
      return res
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

console.log(`Server running at http://localhost:${server.port}`)
console.log('Available endpoints:')
console.log('  POST /command - Execute commands')
console.log('  POST /query   - Execute queries')
console.log('  GET  /health  - Health check')
