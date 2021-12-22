'use strict';

////////////////////////////////////////////////////////////////////
// ELEMENTS

//HOME PAGE
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slider__card');
const btnLeft = document.querySelector('.slider__btn--to-left');
const btnRight = document.querySelector('.slider__btn--to-right');

// RESERVATIONS
const nrPeople = document.querySelector('.reservations__people-number');
const peopleField = document.querySelector('.reservations__people');
const btnSubmit = document.querySelector('.reservations__btn-submit');
const resForm = document.querySelector('.reservations');
const reservations = new Array(); // not kept in local storage as, after inserting a reservation, i don't need the data anymore in the app

//FIND US
const map = document.querySelector('#map');

/////////////////////////////////////////////////////////////////////
// OOP ARCHITECTURE -> I have chosen to structure my JS code in ES6 classes
class Reservation {
  _successMessage = 'You have successfully made your reservation!';

  constructor(formData) {
    try {
      this.name = formData.name;
      this.email = formData.email;

      this._validateDate(formData);

      if ((formData.time = 'PM')) formData.hour = +formData.hour + 12;
      this.date = new Date(
        +formData.year,
        +formData.month - 1,
        +formData.day,
        +formData.hour,
        +formData.min
      );
      this.people = +nrPeople.textContent;
      reservations.push(this);
      console.log(reservations);
      this._insertMessage();
    } catch (err) {
      console.error(err);
    }
  }

  _insertMessage(success = true, message = this._successMessage) {
    const markup = `
    <div class="reservations__msg reservations__${
      success ? 'validation' : 'error'
    }-message">
      <svg>
        <use xlink:href="../src/img/icons.svg#icon-warning"></use>
      </svg>
      <span>${message}</span>
    </div>
    `;
    resForm.insertAdjacentHTML('beforeend', markup);
    // successful reservations clears the form
    if (success) {
      resForm.reset();
      nrPeople.innerHTML = '4';
    }
    // clear the message after displaying for 3s
    setTimeout(
      () => resForm.querySelector('.reservations__msg').remove(),
      3000
    );
  }

  _throwError(message) {
    this._insertMessage(false, message);
    throw new Error(message);
  }

  _validateDate(formData) {
    // Bussiness and logical rules for a valid date
    // 1. Restaurant program :  all week 12:00-2:30, Sun-Thu 18:00 - 22:30, Fri-Sat: 18:00 - 23:30
    const programError =
      'The time you have chosen is outside our working hours! Please re-check our program!';
    const calendarError =
      'Please choose a date within one month from the moment of reservation!';
    // 2. Check for correct date
    const invalidError = 'Invalid date. Please try again!';

    const day = +formData.day;
    const month = +formData.month;
    const year = +formData.year;
    const hour = +formData.hour;
    const min = +formData.min;
    const oneMonthTimestamp = 60 * 60 * 24 * 31 * 1000;
    const currentDate = new Date();

    // Valid month
    if (month > 12 || month < 1) this._throwError(invalidError);

    //Valid year
    if (
      !(
        (currentDate.getMonth() + 1 === 12 &&
          year === currentDate.getFullYear() + 1) ||
        year === currentDate.getFullYear()
      )
    )
      this._throwError(invalidError);

    //Valid day
    let monthUpperLimit;
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      monthUpperLimit = 31;
    }
    if ([4, 6, 9, 11].includes(month)) {
      monthUpperLimit = 30;
    }
    if (month === 2) {
      monthUpperLimit = 28;
    }
    if (day < 1 || day > monthUpperLimit) this._throwError(invalidError);

    const validDate = new Date(year, month - 1, day);
    const weekday = validDate.getDay(); //wkday as a number

    if (validDate.getTime() < Date.now()) this._throwError(invalidError);
    if (validDate.getTime() > Date.now() + oneMonthTimestamp)
      this._throwError(calendarError);

    // Valid hours
    if (hour > 12 || hour < 1) this._throwError(invalidError);

    if (formData.time === 'AM') {
      if (hour < 12) this._throwError(programError); // 12:00 - 12:59 is the only AM interval supported
    }
    if (formData.time === 'PM') {
      const closingHour = [7, 1, 2, 3, 4].includes(weekday) ? 10 : 11;
      //det closingHour for the day chosen in PM (also ignoring the 30 min between 10/11:00 - 10/11:30)

      if ((hour > 2 && hour < 6) || (hour >= closingHour && hour <= 12))
        this._throwError(programError);
    }
  }
}

class App {
  _patooLat = 53.368248;
  _patooLng = -1.499549;
  _mapZoom = 17;
  _map;
  constructor() {
    this._loadMap();
    //Attach event handlers
    btnRight?.addEventListener('click', this._slideToRight.bind(this));
    btnLeft?.addEventListener('click', this._slideToLeft.bind(this));

    peopleField?.addEventListener('click', this._changePeopleNumber);
    resForm?.addEventListener('submit', this._submitForm);
  }

  // SLIDER METHODS
  _slidePositions(slideTo) {
    if (slideTo === 0) {
      slides[0].style.transform = 'translate(-50%, 1.5rem)';
      slides[1].style.transform = 'translate(calc(50% + 3rem), 0.75rem)';
      slides[2].style.transform = ' translate(calc(150% + 6rem), 0)';
      slides[3].style.transform = 'translate(calc(250% + 9rem), 0)';
      slides[4].style.transform = 'translate(calc(350% + 12rem), 0)';
    }

    if (slideTo === 1) {
      slides[0].style.transform = ' translate(calc(-150% - 3rem), 0.75rem)';
      slides[1].style.transform = 'translate(-50%, 1.5rem)';
      slides[2].style.transform = 'translate(calc(50% + 3rem), 0.75rem)';
      slides[3].style.transform = ' translate(calc(150% + 6rem), 0)';
      slides[4].style.transform = 'translate(calc(250% + 9rem), 0)';
    }

    if (slideTo === 2) {
      slides[0].style.transform = ' translate(calc(-250% - 6rem), 0)';
      slides[1].style.transform = 'translate(calc(-150% - 3rem), 0.75rem)';
      slides[2].style.transform = 'translate(-50%, 1.5rem)';
      slides[3].style.transform = ' translate(calc(50% + 3rem), 0.75rem)';
      slides[4].style.transform = 'translate(calc(150% + 6rem), 0)';
    }
    if (slideTo === 3) {
      slides[0].style.transform = 'translate(calc(-350% - 9rem), 0)';
      slides[1].style.transform = ' translate(calc(-250% - 6rem), 0)';
      slides[2].style.transform = 'translate(calc(-150% - 3rem), 0.75rem)';
      slides[3].style.transform = 'translate(-50%, 1.5rem)';
      slides[4].style.transform = ' translate(calc(50% + 3rem), 0.75rem)';
    }
    if (slideTo === 4) {
      slides[0].style.transform = 'translate(calc(-450% - 12rem), 0)';
      slides[1].style.transform = 'translate(calc(-350% - 9rem), 0)';
      slides[2].style.transform = ' translate(calc(-250% - 6rem), 0)';
      slides[3].style.transform = 'translate(calc(-150% - 3rem), 0.75rem)';
      slides[4].style.transform = 'translate(-50%, 1.5rem)';
    }
  }

  _checkForBtnRemoval(nextSlideTo) {
    if (nextSlideTo < 0) {
      btnLeft.classList.add('slider__btn--hidden');
    } else if (nextSlideTo > 4) {
      btnRight.classList.add('slider__btn--hidden');
    } else {
      btnLeft.classList.remove('slider__btn--hidden');
      btnRight.classList.remove('slider__btn--hidden');
    }
  }

  _slideToLeft() {
    const slideTo = +btnLeft.dataset.slideTo;
    console.log(slideTo);

    slides[slideTo + 1].classList.remove('slider__card--active');
    slides[slideTo].classList.add('slider__card--active');

    this._slidePositions(slideTo);

    this._checkForBtnRemoval(slideTo - 1);
    btnLeft.dataset.slideTo = slideTo - 1;
    btnRight.dataset.slideTo = slideTo + 1;
  }

  _slideToRight() {
    const slideTo = +btnRight.dataset.slideTo;
    console.log(slideTo);

    slides[slideTo - 1].classList.remove('slider__card--active');
    slides[slideTo].classList.add('slider__card--active');

    this._slidePositions(slideTo);

    this._checkForBtnRemoval(slideTo + 1);
    btnRight.dataset.slideTo = slideTo + 1;
    btnLeft.dataset.slideTo = slideTo - 1;
  }

  // RESERVATIONS FORM METHODS
  _changePeopleNumber(e) {
    const btn = e.target.closest('.reservations__btn');
    if (!btn) return;

    const currentNumber = +nrPeople.textContent;
    const operation = btn.dataset.operation;
    if (
      (currentNumber <= 1 && operation === '-') ||
      (currentNumber >= 20 && operation === '+')
    )
      return;

    nrPeople.innerHTML =
      operation === '+' ? currentNumber + 1 : currentNumber - 1;
  }

  _submitForm(e) {
    e.preventDefault();
    const dataArr = [...new FormData(this)]; //this points to the form inside of the handler
    const data = Object.fromEntries(dataArr);
    console.log(data);
    new Reservation(data);
    console.log(reservations);
  }

  //MAP METHODS
  _loadMap() {
    if (!map) return;

    this._map = L.map('map').setView(
      [this._patooLat, this._patooLng],
      this._mapZoom
    );

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    L.marker([this._patooLat, this._patooLng]).addTo(this._map);
  }
}

const app = new App();
