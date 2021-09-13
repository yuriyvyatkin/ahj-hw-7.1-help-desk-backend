const tickets = require('./tickets');
const Ticket = require('./Ticket');
const TicketFull = require('./TicketFull');
const getFormattedDate = require('./getFormattedDate');
const Koa = require('koa');
const koaBody = require('koa-body');
const uuid = require('uuid');
const app = new Koa();

app.use(koaBody());

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

app.use(async ctx => {
  const { method } = ctx.request.query;
  const id = ctx.request.query.id;
  const ticketIndex = tickets[0].findIndex((ticket) => ticket.id === id);
  const body = ctx.request.body;

  switch (method) {
    case 'allTickets':
      ctx.response.body = JSON.stringify(
        tickets[0]
      );
      ctx.response.status = 200;
      return;
    case 'allFullTickets':
      ctx.response.body = JSON.stringify(
        tickets[1]
      );
      ctx.response.status = 200;
      return;
    case 'ticketById':
      const foundTicket = tickets[1].find((ticket) => ticket.id === id);
      ctx.assert(foundTicket, 410, 'Ticket not found!');
      ctx.response.body = JSON.stringify(foundTicket);
      ctx.response.status = 200;
      return;
    case 'createTicket':
      const creationParameters = ['name', 'description', 'status'];
      creationParameters.forEach((parameter) => {
        ctx.assert(body[parameter], 400, `Parameter ${parameter} not found!`);
      });
      body.id = `ticket${uuid.v1()}`;
      body.created = getFormattedDate();
      tickets[0].push(new Ticket(body));
      tickets[1].push(new TicketFull(body));
      ctx.response.body = JSON.stringify(body);
      ctx.response.status = 200;
      return;
    case 'deleteTicket':
      if (ticketIndex === -1) {
        ctx.throw(410, 'Id not found!');
      }
      tickets[0].splice(ticketIndex, 1);
      tickets[1].splice(ticketIndex, 1);
      ctx.response.status = 204;
      return;
    case 'editTicket':
      if (ticketIndex === -1) {
        ctx.throw(410, 'Id not found!');
      }
      if (!body.name || !body.name.trim()) {
        delete body.name;
      }
      if (!body.description || !body.description.trim()) {
        delete body.description;
      }
      tickets[0][ticketIndex] = {
        ...tickets[0][ticketIndex],
        ...ctx.request.body,
      }
      tickets[1][ticketIndex] = {
        ...tickets[1][ticketIndex],
        ...ctx.request.body,
      }
      if (Object.keys(body).length) {
        ctx.response.body = JSON.stringify(body);
      }
      ctx.response.status = 200;
      return;
    default:
      ctx.response.status = 404;
      return;
  }
});

app.listen(process.env.PORT || 3000);
