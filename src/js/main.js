import './_vendor';
import vars from './_vars';
import './_functions';
import './_components';

const searchInput = document.querySelector('.header__search');
const titleTable = document.querySelectorAll('.thead__title');
const titleTableId = document.querySelector('.thead__title--id');
const titleTableName = document.querySelector('.thead__title--name');
const titleTableCreated = document.querySelector('.thead__title--created');
const titleTableUpdated = document.querySelector('.thead__title--updated');

async function loadClientsSearch(search = '') {
  const response = await fetch('http://localhost:5500/api/clients');
  const data = await response.json();
  const dataSearch = data.filter(item =>
    (item.name + item.surname + item.middlename).toLowerCase().trim()
    .includes(search.toLowerCase().trim()))
  return dataSearch;
};

async function loadClient(id) {
  const response = await fetch('http://localhost:5500/api/clients');
  const data = await response.json();
  const client = data.filter(item => item.id === id)
  return client;
};

async function deletedClient(id) {
  const response = await fetch(`http://localhost:5500/api/clients/${id}`, {
    method: 'DELETE',
  });
};

function checkLoadPhone(value, isHide = false, index, indexContact, type = 'Телефон') {
  const contact = `<li class="list__item ${isHide ? 'is-hide' : ''}">
      <a href="tel:${value}" class="list__link list__link--${index}${indexContact}" data-contact="${type}: ${value}" aria-label="Позвонить">
        <svg class="list__icon list__icon--phone" width="16" height="16">
            <circle cx="8" cy="8" r="8"/>
            <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z"/>
        </svg>
      </a>
    </li>`;
  return contact;
};

function checkLoadMail(value, isHide = false, index, indexContact, type = 'Email') {
  const contact = `<li class="list__item ${isHide ? 'is-hide' : ''}">
      <a href="mailto:${value}" class="list__link list__link--${index}${indexContact}" data-contact="${type}: ${value}" aria-label="Написать на почту">
        <svg class="list__icon" width="16" height="16">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z"/>
        </svg>
      </a>
    </li>`;
  return contact;
};

function checkLoadVk(value, isHide = false, index, indexContact, type = 'ВК') {
  const contact = `<li class="list__item ${isHide ? 'is-hide' : ''}">
      <a href="http://${value}" class="list__link list__link--${index}${indexContact}" data-contact="${type}: ${value}" aria-label="Перейти на профиль в ВК">
        <svg class="list__icon" width="16" height="16">
          <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z"/>
        </svg>
      </a>
    </li>`;
  return contact;
};

function checkLoadFb(value, isHide = false, index, indexContact, type = 'Facebook') {
  const contact = `<li class="list__item ${isHide ? 'is-hide' : ''}">
      <a href="http://${value}" class="list__link list__link--${index}${indexContact}" data-contact="${type}: ${value}" aria-label="Перейти на профиль в Фэйсбук">
        <svg class="list__icon" width="16" height="16">
          <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z"/>
        </svg>
      </a>
    </li>`;
  return contact;
};

function checkLoadOther(value, isHide = false, index, indexContact, type = 'Другой') {
  const contact = `<li class="list__item ${isHide ? 'is-hide' : ''}">
      <a href="http://${value}" class="list__link list__link--${index}${indexContact}" data-contact="${type}: ${value}" aria-label="Перейти на профиль">
        <svg class="list__icon" width="16" height="16">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z"/>
        </svg>
      </a>
    </li>`;
  return contact;
};

function loadContacts(type, value, isHide, index, indexContact) {
  let contact = '';
  if(type === 'Phone') {
    contact += checkLoadPhone(value, isHide, index, indexContact);
  };
  if(type === 'Mail') {
    contact += checkLoadMail(value, isHide, index, indexContact);
  };
  if(type === 'VK') {
    contact += checkLoadVk(value, isHide, index, indexContact);
  };
  if(type === 'FB') {
    contact += checkLoadFb(value, isHide, index, indexContact);
  };
  if(type === 'Other') {
    contact += checkLoadOther(value, isHide, index, indexContact);
  };
  return contact;
};

function clickTitleTable(field, arr, sortedField1, sortedField2, sortedField3) {
  const asc = field.dataset.asc === 'true' ? false : true;
  field.dataset.asc = asc;
  field.dataset.listener = true;
  titleTable.forEach(title => {
    title.classList.remove('thead__title--active');
  });
  field.classList.add('thead__title--active');
  sortedClients(arr, asc, sortedField1, sortedField2, sortedField3);
}

function addTooltipContacs() {
  const contactsItem = document.querySelectorAll('.list__link');

  for(let i = 0; i < contactsItem.length; i++) {
    if (contactsItem[i].dataset.contact != undefined) {
      const item = contactsItem[i].classList[1];
      const content = contactsItem[i].dataset.contact;

      tippy(`.${item}`, {
        content: content,
        trigger: 'mouseenter',
      });
    }
  }
}

function createClientsElements(data) {
  const container = document.querySelector('.container--main');
  const mainBtn = document.querySelector('.main__btn');
  const notFoundClient = document.querySelector('.clients-not-found');
  const tableBlock = document.querySelector('.main__tbody');
  const loadBlock = document.querySelector('.main__load');
  tableBlock.innerHTML = '';

  if(data.length > 0) {
    data.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.classList.add('tbody__tr');

      const name = item.surname + ' ' + item.name + ' ' + item.middlename;
      const createdDate = new Date(item.created).toLocaleDateString("ru");
      const createdTime = new Date(item.created).toLocaleString("ru",
        { hour: 'numeric', minute: 'numeric' });
      const updatedDate = new Date(item.created).toLocaleDateString("ru");
      const updatedTime = new Date(item.created).toLocaleString("ru",
        { hour: 'numeric', minute: 'numeric' });

      const contacts = item.contacts;
      let allContacts = '';

      if(contacts.length < 6) {
        contacts.forEach((contact, indexContact) => {
          allContacts += loadContacts(contact.type, contact.value, false, index, indexContact);
        });
      } else {
        contacts.forEach((contact, indexContact) => {
          if(indexContact < 4) {
            allContacts += loadContacts(contact.type, contact.value, false, index, indexContact);
          } else {
            allContacts += loadContacts(contact.type, contact.value, true, index, indexContact);
          };
        });

        const moreContactsView = `<li class="list__item">
            <a href="#" class="list__link list__link--more">+${contacts.length - 4}</a>
          </li>`;

        allContacts += moreContactsView;
      }


      tr.innerHTML = `<td scope="row" class="tbody__title tbody__title--id">${item.id}</td>
          <td scope="row" class="tbody__title tbody__title--name">${name}</td>
          <td scope="row" class="tbody__title tbody__title--created">${createdDate} <span class="tbody__time">${createdTime}</span></td>
          <td scope="row" class="tbody__title tbody__title--updated">${updatedDate} <span class="tbody__time">${updatedTime}</span></td>
          <td scope="row" class="tbody__title tbody__title--contacts">
            <ul class="tbody__list list">
              ${allContacts}
            </ul>
          </td>
          <td class="tbody__title tbody__title--actions" scope="row">
            <button class="tbody__btn tbody__btn--update">Изменить</button>
            <button class="tbody__btn tbody__btn--delete">Удалить</button>
          </td>`;

      if(notFoundClient !== null) {
        notFoundClient.remove();
      }
      tableBlock.append(tr);
    });
  } else {
    const p = document.createElement('p');
    p.classList.add('clients-not-found');
    p.innerHTML = `Поиск не дал результатов, попробуйте уточнить ФИО клиента`;

    console.log(notFoundClient === null);
    if(notFoundClient === null) {
      container.insertBefore(p, mainBtn)
    }
  }


  let timerId = setTimeout(function() {
    loadBlock.classList.remove('is-active');
    mainBtn.classList.remove('main__btn--load');
    clearTimeout(timerId);
  }, 500);
};

function sortedClients(clients, asc = true, field1 = 'id', field2 = '', field3 = '') {
  const sortClients = clients.sort(function(a, b) {
    if ((a[field1] + a[field2] + a[field3]) > (b[field1] + b[field2] + b[field3])) {
      return 1;
    }
    if ((a[field1] + a[field2] + a[field3]) < (b[field1] + b[field2] + b[field3])) {
      return -1;
    }
    return 0;
  });
  if(!asc) {
    const sortClientsDesc = sortClients.reverse();
    createClientsElements(sortClientsDesc);
    addTooltipContacs();
    return;
  }
  createClientsElements(sortClients);
  addTooltipContacs();
}

function actionsClients() {
  const page = document.querySelector('.page__body');
  const btnAddClient = document.querySelector('.main__btn--load');
  const btnsUpdate = document.querySelectorAll('.tbody__btn--update');
  const popupUpdate = document.querySelector('.popup-update');
  const popupDelete = document.querySelector('.popup-delete');
  const popupNew = document.querySelector('.popup-new');
  const popupWrapContainer = popupUpdate.querySelector('.update__wrap');

  let clientId;

  btnsUpdate.forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const clientUpdate = btn.parentElement.parentElement;

      for(let i = 0; i < clientUpdate.children.length; i++) {
        if(clientUpdate.children[i].classList.contains('tbody__title--id')) {
          clientId = clientUpdate.children[i].innerHTML;
        }
      }

      const client = (await loadClient(clientId))[0];

      popupWrapContainer.innerHTML = `<h2 class="update__title">Изменить данные</h2>
        <p class="update__subtitle">ID: ${client.id}</p>
        <form class="update__form">
          <label class="update__label update__label--req">Фамилия</label>
          <input type="text" class="update__input" value="${client.surname}">
          <label class="update__label update__label--req">Имя</label>
          <input type="text" class="update__input" value="${client.name}">
          <label class="update__label">Отчество</label>
          <input type="text" class="update__input" value="${client.middlename}">
          <button class="update__add">
            <svg class="update__icon-add" width="16" height="16">
              <use xlink:href="img/sprite.svg#add_circle"></use>
            </svg>
            Добавить контакт
          </button>
          <button class="update__save">Сохранить</button>
          <button class="update__delete">Удалить клиента</button>
        </form>
        <button class="update__close">
          <svg class="update__icon" width="29" height="29">
            <use xlink:href="img/sprite.svg#close"></use>
          </svg>
        </button>`;

      page.classList.add('is-popup');
      popupUpdate.classList.add('is-active');

      const popupUpdateClose = popupUpdate.querySelector('.update__close');
      const popupUpdateDelete = popupUpdate.querySelector('.update__delete');

      popupUpdateClose.addEventListener('click', e => {
        e.preventDefault();
        popupUpdate.classList.remove('is-active');
        page.classList.remove('is-popup');
      });

      popupUpdate.addEventListener('click', e => {
        e.preventDefault();
        if(e.target.classList.contains('popup-update')) {
          page.classList.remove('is-popup');
          popupUpdate.classList.remove('is-active');
        }
      });

      popupUpdateDelete.addEventListener('click', e => {
        popupUpdate.classList.remove('is-active');
        popupDelete.classList.add('is-active');

        const popupDeleteClose = popupDelete.querySelector('.delete__close');
        const popupDeleteCancel = popupDelete.querySelector('.delete__cancel');
        const popupDeleteDelete = popupDelete.querySelector('.delete__delete');

        popupDeleteClose.addEventListener('click', e => {
          e.preventDefault();
          page.classList.remove('is-popup');
          popupDelete.classList.remove('is-active');
        });

        popupDeleteCancel.addEventListener('click', e => {
          e.preventDefault();
          page.classList.remove('is-popup');
          popupDelete.classList.remove('is-active');
        });

        popupDelete.addEventListener('click', e => {
          e.preventDefault();
          if(e.target.classList.contains('popup-delete')) {
            page.classList.remove('is-popup');
            popupDelete.classList.remove('is-active');
          }
        });

        popupDeleteDelete.addEventListener('click', async e => {
          e.preventDefault();
          await deletedClient(clientId);
          await createClients();
          page.classList.remove('is-popup');
          popupDelete.classList.remove('is-active');
        });
      });
    })
  });

  btnAddClient.addEventListener('click', e => {
    e.preventDefault();
    page.classList.add('is-popup');
    popupNew.classList.add('is-active');

    const popupAddClose = popupNew.querySelector('.new__close');
    const popupAddCancel = popupNew.querySelector('.new__cancel');
    const popupAddContact = popupNew.querySelector('.new__contact');
    const newTypeContacts = document.querySelectorAll('.new__type-contact');

    popupAddClose.addEventListener('click', e => {
      e.preventDefault();
      page.classList.remove('is-popup');
      popupNew.classList.remove('is-active');
    });

    popupAddCancel.addEventListener('click', e => {
      e.preventDefault();
      page.classList.remove('is-popup');
      popupNew.classList.remove('is-active');
    });

    popupNew.addEventListener('click', e => {
      e.preventDefault();
      if(e.target.classList.contains('popup-new')) {
        page.classList.remove('is-popup');
        popupNew.classList.remove('is-active');
      }
    });

    newTypeContacts.forEach(newTypeContact => {
      const choicesnewTypeContact = new Choices(newTypeContact, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false
      });
    })

    popupAddContact.addEventListener('click', e => {
      e.preventDefault();
      console.log('add');
      const newContactHide = document.querySelector('.new__row-contact.is-hide');
      if (newContactHide) {
        newContactHide.classList.remove('is-hide');
      } else {
        popupAddContact.classList.add('is-disable');
      }

    })
  })
}

async function createClients() {
  const strSearch = searchInput.value;
  const clients = await loadClientsSearch(strSearch);

  sortedClients(clients);

  titleTableId.onclick = function (){
    clickTitleTable(titleTableId, clients);
  };

  titleTableName.onclick = function (){
    clickTitleTable(titleTableName, clients, 'surname', 'name', 'middlename');
  };

  titleTableCreated.onclick = function (){
    clickTitleTable(titleTableCreated, clients, 'created');
  };

  titleTableUpdated.onclick = function (){
    clickTitleTable(titleTableUpdated, clients, 'updated');
  };

  addTooltipContacs();
  actionsClients();
};

createClients();

searchInput.addEventListener('input', e => {
  e.preventDefault();
  let timerId = setTimeout(function() {
    createClients();
    clearTimeout(timerId);
  }, 300);
})
