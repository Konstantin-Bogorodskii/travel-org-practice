document.addEventListener('DOMContentLoaded', function () {
   // запуск js после загрузки дом дерева
   'use strict';

   // ********* TABS *********
   let infoHeaderTabs = document.querySelectorAll('.info-header-tab');
   let info = document.querySelector('.info-header');
   let tabContent = document.querySelectorAll('.info-tabcontent');

   function hideTabContent(item) {
      for (let i = item; i < tabContent.length; i++) {
         tabContent[i].classList.remove('show');
         tabContent[i].classList.add('hide');
      }
   }

   hideTabContent(1);

   function showTabContent(item) {
      if (tabContent[item].classList.contains('hide')) {
         tabContent[item].classList.remove('hide');
         tabContent[item].classList.add('show');
      }
   }

   info.addEventListener('click', event => {
      for (let i = 0; i < infoHeaderTabs.length; i++) {
         let target = event.target;

         if (target === infoHeaderTabs[i]) {
            hideTabContent(0);
            showTabContent(i);
            break;
         }
      }
   });

   // ********* TIMER *********

   let deadLine = 'September 15 2021 23:59:59 GMT+03:00';

   function getTimeRemaining(endtime) {
      let t = Date.parse(endtime) - Date.parse(new Date());
      let seconds = Math.floor((t / 1000) % 60);
      let minutes = Math.floor((t / 1000 / 60) % 60);
      let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      let days = Math.floor(t / (1000 * 60 * 60 * 24));
      return {
         total: t,
         days: days,
         hours: hours,
         minutes: minutes,
         seconds: seconds,
      };
   }

   function initializeClock(id, endtime) {
      let timer = document.getElementById(id);
      let days = timer.querySelector('.days');
      let hours = timer.querySelector('.hours');
      let minutes = timer.querySelector('.minutes');
      let seconds = timer.querySelector('.seconds');
      let timeInterval = setInterval(function () {
         let t = getTimeRemaining(endtime);
         function addZero(num) {
            if (num <= 9) {
               return '0' + num;
            } else {
               return num;
            }
         }

         days.textContent = t.days;
         hours.textContent = addZero(t.hours);
         minutes.textContent = addZero(t.minutes);
         seconds.textContent = addZero(t.seconds);

         if (t.total <= 0) {
            clearInterval(timeInterval);
            hours.textContent = '00';
            minutes.textContent = '00';
            seconds.textContent = '00';
         }
      }, 1000);
   }

   initializeClock('timer', deadLine);

   // Modal

   let popupOpen = document.querySelector('.more');
   let popupClose = document.querySelector('.popup-close');
   let popup = document.querySelector('.overlay');

   const disableScroll = () => {
      const widthScroll = window.innerWidth - document.body.offsetWidth;
      if (document.disableScroll) return;
      document.disableScroll = true;
      document.body.dbScrollY = window.scrollY;
      document.body.style.cssText = `
      position: fixed;
      top: ${-window.scrollY}px;
      left: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      padding-right: ${widthScroll}px;
    `;
   };

   const enableScroll = () => {
      document.disableScroll = false;
      document.body.style.cssText = '';
      window.scroll({
         top: document.body.dbScrollY,
      });
   };

   const cartModalOpen = () => {
      popup.style.display = 'block';
      popup.classList.add('fade');
      disableScroll();
   };

   const cartModalClose = () => {
      popup.style.display = 'none';
      popup.classList.remove('fade');
      enableScroll();
   };

   popupOpen.addEventListener('click', cartModalOpen);

   popupClose.addEventListener('click', cartModalClose);

   document.addEventListener('keydown', event => {
      if (event.keyCode === 27) {
         cartModalClose();
      }
   });

   // FORM

   let message = {
      loading: 'Загрузка...',
      success: 'Спасибо! Скоро мы с вами свяжемся!',
      failure: 'Что-то пошло не так...',
   };

   let form = document.querySelector('.main-form'),
      input = form.getElementsByTagName('input'),
      statusMessage = document.createElement('div');

   statusMessage.classList.add('status');

   form.addEventListener('submit', function (event) {
      event.preventDefault();
      form.appendChild(statusMessage);

      let request = new XMLHttpRequest();
      request.open('POST', 'server.php');
      request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

      let formData = new FormData(form);

      let obj = {};
      formData.forEach(function (value, key) {
         obj[key] = value;
      });
      let json = JSON.stringify(obj);

      request.send(json);

      request.addEventListener('readystatechange', function () {
         if (request.readyState < 4) {
            statusMessage.innerHTML = message.loading;
         } else if (request.readyState === 4 && request.status == 200) {
            statusMessage.innerHTML = message.success;
         } else {
            statusMessage.innerHTML = message.failure;
         }
      });

      for (let i = 0; i < input.length; i++) {
         input[i].value = '';
      }
   });
});
