function getFormattedDate() {
  const date = new Date();

  const options = { dateStyle: 'short', timeStyle: 'short' };

  const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(date).split(',').join('');

  return formattedDate;
}

module.exports = getFormattedDate;
