const tickets = require('./tickets');
const Ticket = require('./Ticket');
const TicketFull = require('./TicketFull');
const uuid = require('uuid');

class TicketController {
  constructor(data) {
    this.data = data;
  }

  getTicketIndex() {
    return tickets[0].findIndex((ticket) => ticket.id === this.data.id);
  }

  getUnknownTicketResponse() {
    const message = `Ticket with id #"${this.data.id}" not found!`;
    const status = 400;
    return { message, status };
  }

  static getFormattedDate() {
    const date = new Date();

    const options = { dateStyle: 'short', timeStyle: 'short' };

    const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(date).split(',').join('');

    return formattedDate;
  }

  static getTickets() {
    const body = JSON.stringify(
      tickets[0]
    );
    const status = 200;
    return { body, status };
  }

  static getFullTickets() {
    const body = JSON.stringify(tickets[1]);
    const status = 200;
    return { body, status };
  }

  getTicketFull() {
    const foundTicket = tickets[1].find((ticket) => ticket.id === this.data.id);
    if (foundTicket) {
      const body = JSON.stringify(foundTicket);
      const status = 200;
      return { body, status };
    }
    return this.getUnknownTicketResponse();
  }

  createTicket() {
    const creationParameters = ['name', 'description', 'status'];
    const missingParameter = creationParameters.find((parameter) => {
      return !this.data[parameter];
    });
    if (missingParameter) {
      return this.getUnknownTicketResponse();
    }
    const newTicket = {
      id: `ticket${uuid.v1()}`,
      name : this.data.name,
      description: this.data.description,
      status: false,
      created: this.constructor.getFormattedDate(),
    }
    tickets[0].push(new Ticket(newTicket));
    tickets[1].push(new TicketFull(newTicket));
    const body = JSON.stringify(newTicket);
    const status = 200;
    return { body, status };
  }

  deleteTicket() {
    const ticketIndex = this.getTicketIndex();
    if (ticketIndex === -1) {
      return this.getUnknownTicketResponse();
    }
    tickets[0].splice(ticketIndex, 1);
    tickets[1].splice(ticketIndex, 1);
    const status = 204;
    return { status };
  }

  changeTicket() {
    const ticketIndex = this.getTicketIndex();
    if (ticketIndex === -1) {
      return this.getUnknownTicketResponse();
    }
    delete this.data.method;
    if (!this.data.name || !this.data.name.trim()) {
      delete this.data.name;
    }
    if (!this.data.description || !this.data.description.trim()) {
      delete this.data.description;
    }
    if (this.data.status) {
      this.data.status = this.data.status === 'true' ? true : false;
    }
    tickets[0][ticketIndex] = {
      ...tickets[0][ticketIndex],
      ...this.data,
    }
    tickets[1][ticketIndex] = {
      ...tickets[1][ticketIndex],
      ...this.data,
    }
    if (Object.keys(this.data).length) {
      const body = JSON.stringify(this.data);
      const status = 200;
      return { body, status };
    } else {
      const status = 204;
      return { status };
    }
  }
}

module.exports = TicketController;
