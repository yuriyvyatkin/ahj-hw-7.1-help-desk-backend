const TicketController = require('./TicketController');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const app = new Koa();

app.use(koaBody());

app.use(cors());

app.use(async ctx => {
  let ticketController;
  const { method } = ctx.request;
  let operation;

  console.log(method)

  if (method === 'GET' || method === 'DELETE') {
    operation = ctx.request.query.method;
    ticketController = new TicketController(ctx.request.query);
  } else if (method === 'POST' || method === 'PATCH') {
    operation = ctx.request.body.method;
    ticketController = new TicketController(ctx.request.body);
    console.log(operation)
    console.log(JSON.stringify(ticketController))
  } else {
    ctx.response.body = `Error! Unknown method '${method}' in request parameters.`;
    ctx.response.status = 404;
    return;
  }

  let response;

  switch (operation) {
    case 'allTickets':
      ctx.response = ticketController.constructor.getTickets();
      break;
    case 'allFullTickets':
      response = ticketController.constructor.getFullTickets();
      ctx.response.body = response.body;
      ctx.response.status = response.status;
      break;
    case 'ticketById':
      response = ticketController.getTicketFull(ctx.request.query);
      ctx.response.body = response.body;
      ctx.response.status = response.status;
      break;
    case 'createTicket':
      response = ticketController.createTicket(ctx.request.body);
      ctx.response.body = response.body;
      ctx.response.status = response.status;
      break;
    case 'deleteTicket':
      response = ticketController.deleteTicket(ctx.request.body);
      ctx.response.status = response.status;
      break;
    case 'changeTicket':
      response = ticketController.changeTicket(ctx.request.body);
      ctx.response.body = response.body;
      ctx.response.status = response.status;
      break;
    default:
      ctx.response.body = `Unknown operation '${operation}' in a query`;
      ctx.response.status = 404;
  }
});

app.listen(process.env.PORT || 3000);
