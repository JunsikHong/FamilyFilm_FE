const calendar = (schedule, date) => {
  const currentYear = new Date(date).getFullYear();
  const currentMonth = new Date(date).getMonth() + 1;

  const firstDay = new Date(date.setDate(1)).getDay();
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();

  const limitDay = firstDay + lastDay;
  const nextDay = Math.ceil(limitDay / 7) * 7;

  let htmlDummy = '';

  for (let i = 0; i < firstDay; i++) {
    htmlDummy += `<div class="noColor"></div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    htmlDummy += `<div>${i}</br></div>`;
  }

  for (let i = limitDay; i < nextDay; i++) {
    htmlDummy += `<div class="noColor"></div>`;
  }

  document.querySelector(`.dateBoard`).innerHTML = htmlDummy;
  document.querySelector(`.dateTitle`).innerText = `${currentYear}년 ${currentMonth}월`;

  schedule.forEach(element => {
    const taskDate = new Date(element.schedule_date);
    if (taskDate.getFullYear() === currentYear && taskDate.getMonth() + 1 === currentMonth) {
      const dayElement = document.querySelector(`.dateBoard div:nth-child(${taskDate.getDate() + firstDay})`);

      if (dayElement) {
        const newElement = document.createElement('p');
        newElement.classList.add('hasTask');
        newElement.style.backgroundColor = element.schedule_color;
        dayElement.appendChild(newElement);
      }
    }
  });
}

export default calendar;