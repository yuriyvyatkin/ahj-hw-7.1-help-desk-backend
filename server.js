const Ticket = require('./Ticket');
const TicketFull = require('./TicketFull');
const Koa = require('koa');
const koaBody = require('koa-body');
const uuid = require('uuid');
const app = new Koa();

app.use(koaBody());

const tickets = [
  [
    {
      id: 1,
      name: 'Задача 1',
      status: false,
      created: '22.02.2022 12:20'
    },
    {
      id: 2,
      name: 'Задача 2',
      status: false,
      created: '22.02.2022 12:20'
    },
    {
      id: 3,
      name: 'Задача 3',
      status: false,
      created: '22.02.2022 12:20'
    }
  ],
  [
    {
      id: 1,
      name: 'Задача 1',
      description: 'Описание задачи 1',
      status: false,
      created: '22.02.2022 12:20'
    },
    {
      id: 2,
      name: 'Задача 2',
      description: 'Описание задачи 2',
      status: false,
      created: '22.02.2022 12:20'
    },
    {
      id: 3,
      name: 'Задача 3',
      description: 'Описание задачи 3',
      status: false,
      created: '22.02.2022 12:20'
    }
  ]
];

app.use(async ctx => {
  const { method } = ctx.request.query;

  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
  });

  switch (method) {
    case 'allTickets':
      ctx.response.body = JSON.stringify(
        tickets[0]
      );
      return;
    case 'ticketById':
      const id = Number(ctx.request.query.id);
      ctx.response.body = JSON.stringify(
        tickets[1].find((ticket) => ticket.id === id)
      );
      return;
    case 'createTicket':
      const body = ctx.request.body;
      body.id = uuid.v1();
      tickets[0].push(new Ticket(body));
      tickets[1].push(new TicketFull(body));
      return;
    default:
      ctx.response.status = 404;
      return;
  }
});

app.listen(process.env.PORT || 3000);
