const searchInput = document.querySelector('.header__search');
const titleTable = document.querySelectorAll('.thead__title');
const titleTableId = document.querySelector('.thead__title--id');
const titleTableName = document.querySelector('.thead__title--name');
const titleTableCreated = document.querySelector('.thead__title--created');
const titleTableUpdated = document.querySelector('.thead__title--updated');


// secondary functions
function checkHeight() {
  const popup = document.querySelector('.popup.is-active .new__wrap') || document.querySelector('.popup.is-active .update__wrap');
  const heightPopup = popup.offsetHeight;
  const heightYiewport = window.innerHeight;

  if(heightPopup >= heightYiewport - 20) {
    popup.classList.add('is-height');
  } else {
    if(popup.classList.contains('is-height')) {
      popup.classList.remove('is-height');
    }
  };
};

function capitalize(s) {
  s = s && s[0].toUpperCase() + s.slice(1).toLowerCase();
  return s;
};

function validFormCheck(popup, surname, name) {
  const contactList = [];
  let valid = false;
  let error = '';
  let errorInput = '';

  if(surname.length > 0) {
    const reg = /^[а-яёА-ЯЁ]+$/u;
    if(surname.match(reg)) {
      if(name.length > 0) {
        if(name.match(reg)) {
          valid = true;

          let contacts;
          if(popup.querySelectorAll('.new__row-contact').length === 0) {
            contacts = popup.querySelectorAll('.update__row-contact.is-view');
          } else {
            contacts = popup.querySelectorAll('.new__row-contact.is-view');
          };

          if(contacts.length > 0) {
            errorInput = [];
            error = [];
            contacts.forEach((el, index) => {
              if(!el.classList.contains('is-hide')) {
                const typeContact = el.querySelector('.is-selected').dataset.value;
                const contactItem = el.querySelector('.new__value') || el.querySelector('.update__value');
                const contact = contactItem.value.trim();

                if(typeContact === 'Phone') {
                  const reg = /^\+?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/;
                  if(contact.match(reg)) {
                    valid = true;
                  } else {
                    valid = false;
                    error.push('Ошибка: неверный формат телефона!');
                    errorInput.push(index);
                  };
                };
                if(typeContact === 'Email') {
                  const reg = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
                  if(contact.match(reg)) {
                    valid = true;
                  } else {
                    valid = false;
                    error.push('Ошибка: неверный формат e-mail!');
                    errorInput.push(index);
                  };
                };
                if(typeContact === 'VK') {
                  const reg = /^(https?:\/\/)?(www\.)?vk\.com\/(\w|\d)+?\/?$/;
                  if(contact.match(reg)) {
                    valid = true;
                  } else {
                    valid = false;
                    error.push('Ошибка: неверный формат ссылки на ВК!');
                    errorInput.push(index);
                  };
                };
                if(typeContact === 'FB') {
                  const reg = /^(https?:\/\/)?(www\.)?(facebook\.|fb\.)com\/(\w|\d)+?\/?$/;
                  if(contact.match(reg)) {
                    valid = true;
                  } else {
                    valid = false;
                    error.push('Ошибка: неверный формат ссылки на Фэйсбук!');
                    errorInput.push(index);
                  };
                };
                if(typeContact === 'Other') {
                  if(contact.length > 0) {
                    valid = true;
                  } else {
                    valid = false;
                    error.push('Ошибка: контакт не должен быть пустым!');
                    errorInput.push(index);
                  };
                };

                contactList.push({"type": typeContact, "value": contact});
              };
            });
          };
        } else {
          error = 'Ошибка: имя должно содержать только кирилицу!';
          errorInput = 'name';
        };
      } else {
        error = 'Ошибка: введите имя!';
        errorInput = 'name';
      };
    } else {
      error = 'Ошибка: фамилия должна содержать только кирилицу!';
      errorInput = 'surname';
    };
  } else {
    error = 'Ошибка: введите фамилию!';
    errorInput = 'surname';
  };

  return {valid, error, contactList, errorInput};
};

// function api server
async function loadClientsSearch(search = '') {
  const response = await fetch('http://localhost:5500/api/clients');
  const data = await response.json();
  const dataSearch = data.filter(item =>
    (item.surname + item.name + item.middlename).toLowerCase().trim()
    .includes(search.toLowerCase().trim().split(' ').join('')))
  return dataSearch;
};

async function loadClient(id) {
  const response = await fetch('http://localhost:5500/api/clients');
  const data = await response.json();
  const client = data.filter(item => item.id === id)
  return client;
};

async function addNewClient(surname, name, middlename, contacts) {
  const response = await fetch('http://localhost:5500/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      surname: surname,
      name: name,
      middlename: middlename,
      contacts: contacts
    })
  });
  const data = await response.json();
};

async function deletedClient(id) {
  const response = await fetch(`http://localhost:5500/api/clients/${id}`, {
    method: 'DELETE',
  });
};

async function updatedClient(id, client) {
  const response = await fetch(`http://localhost:5500/api/clients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client)
  });
  const data = await response.json();
};

// function handler contacts clients from server and add page
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
  if(type === 'Email') {
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

function addContactFieldNew() {
  const popupNew = document.querySelector('.popup-new.is-active');
  const popupAddContact = popupNew.querySelector('.new__contact');
  const popupAddClose = popupNew.querySelector('.new__close');
  const popupAddCancel = popupNew.querySelector('.new__cancel');
  const newContact = popupNew.querySelectorAll('.new__row-contact');

  let selectChoices = [];

  function removeContactField() {
    popupAddContact.removeEventListener('click', clickBtnNewContact);
    popupAddContact.classList.remove('is-disable');

    newContact.forEach(el => {
      if(el.classList.contains('is-view')) {
        const newContactInput = el.querySelector('.new__value');
        el.classList.add('is-hide');
        el.classList.remove('is-view');
        newContactInput.value = '';
      }
    });

    selectChoices.forEach(el => {
      const blockSelect = el.passedElement.element.parentElement.parentElement.parentElement;
      blockSelect.innerHTML = `<select name="type-contact" class="new__type-contact choices">
        <option value="Phone" selected>Телефон</option>
        <option value="Email">Email</option>
        <option value="VK">Vk</option>
        <option value="FB">Facebook</option>
        <option value="Other">Другое</option>
      </select>
      <input type="text" class="new__value" placeholder="Введите данные контакта">
      <button class="new__delete-contact">
        <svg class="new__icon" width="12" height="12">
          <use xlink:href="img/sprite.svg#delete-contact"></use>
        </svg>
      </button>`;
    })
  };

  function clickBtnNewContact() {
    checkHeight();
    const newContactHide = popupNew.querySelectorAll('.new__row-contact.is-hide');
    if (newContactHide.length > 1) {
      newContactHide[0].classList.remove('is-hide');
      newContactHide[0].classList.add('is-view');

      const btnContactDelete = newContactHide[0].querySelector('.new__delete-contact');
      btnContactDelete.addEventListener('click', () => {
        checkHeight();
        btnContactDelete.parentElement.classList.add('is-hide');
        btnContactDelete.parentElement.classList.remove('is-view');
        const input = btnContactDelete.parentElement.querySelector('.new__value');
        input.value = '';
      })

    } else if(newContactHide.length === 1) {
      newContactHide[0].classList.remove('is-hide');
      newContactHide[0].classList.add('is-view');
      popupAddContact.classList.add('is-disable');
    }

    const newTypeContactsNew = document.querySelectorAll('.popup.is-active .new__row-contact.is-view .new__type-contact');

    if(newTypeContactsNew.length > 0) {
      selectChoices = [];
      newTypeContactsNew.forEach(element => {
        selectChoices.push(new Choices(element, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false
        }));
      })
    }
  }

  popupAddContact.addEventListener('click', clickBtnNewContact);

  popupAddClose.addEventListener('click', removeContactField);

  popupAddCancel.addEventListener('click', removeContactField);

  popupNew.addEventListener('click', e => {
    e.preventDefault();
    if(e.target.classList.contains('popup-new')) {
      removeContactField();
    }
  });
};

function addContactFieldUpdate(contacts) {
  const popupNew = document.querySelector('.popup-update.is-active');
  const popupAddContact = popupNew.querySelector('.update__contact');
  const popupAddClose = popupNew.querySelector('.update__close');
  const newContact = popupNew.querySelectorAll('.update__row-contact');

  let selectChoices = [];

  function removeContactField() {
    popupAddContact.removeEventListener('click', clickBtnNewContact);
    popupAddContact.classList.remove('is-disable');

    newContact.forEach(el => {
      if(el.classList.contains('is-view')) {
        const newContactInput = el.querySelector('.update__value');
        el.classList.add('is-hide');
        el.classList.remove('is-view');
        newContactInput.value = '';
      }
    });

    selectChoices.forEach(el => {
      const blockSelect = el.passedElement.element.parentElement.parentElement.parentElement;
      blockSelect.innerHTML = `<select name="type-contact" class="update__type-contact choices">
        <option value="Phone" selected>Телефон</option>
        <option value="Email">Email</option>
        <option value="VK">Vk</option>
        <option value="FB">Facebook</option>
        <option value="Other">Другое</option>
      </select>
      <input type="text" class="update__value" placeholder="Введите данные контакта">
      <button class="update__delete-contact">
        <svg class="update__icon" width="12" height="12">
          <use xlink:href="img/sprite.svg#delete-contact"></use>
        </svg>
      </button>`;
    })
  };

  function clickBtnNewContact() {
    checkHeight();
    const newContactHide = popupNew.querySelectorAll('.update__row-contact.is-hide');

    if (newContactHide.length > 1) {
      newContactHide[0].classList.remove('is-hide');
      newContactHide[0].classList.add('is-view');

      const btnContactDelete = newContactHide[0].querySelector('.update__delete-contact');
      btnContactDelete.addEventListener('click', () => {
        checkHeight();
        btnContactDelete.parentElement.classList.add('is-hide');
        btnContactDelete.parentElement.classList.remove('is-view');
        const input = btnContactDelete.parentElement.querySelector('.update__value');
        input.value = '';
      })

    } else if(newContactHide.length === 1) {
      newContactHide[0].classList.remove('is-hide');
      newContactHide[0].classList.add('is-view');
      popupAddContact.classList.add('is-disable');
    }

    const newTypeContactsNew = document.querySelectorAll('.popup.is-active .update__row-contact.is-view .update__type-contact');

    if(newTypeContactsNew.length > 0) {
      selectChoices = [];
      newTypeContactsNew.forEach(element => {
        selectChoices.push(new Choices(element, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false
        }));
      })
    }
  }

  popupAddContact.addEventListener('click', clickBtnNewContact);

  popupAddClose.addEventListener('click', removeContactField);

  popupNew.addEventListener('click', e => {
    e.preventDefault();
    if(e.target.classList.contains('popup-update')) {
      removeContactField();
    }
  });

  if(contacts.length > 0) {
    contacts.forEach(contact => {
      const contactTypeNew = popupNew.querySelector('.update__row-contact.is-hide');
      const contactTypeSelect = contactTypeNew.querySelector('.update__type-contact.choices');
      const contactTypeInput = contactTypeNew.querySelector('.update__value');

      contactTypeSelect.innerHTML = '';

      if(contact.type === 'Phone') {
        contactTypeNew.classList.remove('is-hide');
        contactTypeSelect.innerHTML = `<option value="Phone" selected>Телефон</option>
        <option value="Email">Email</option>
        <option value="VK">Vk</option>
        <option value="FB">Facebook</option>
        <option value="Other">Другое</option>`;
        contactTypeInput.value = contact.value;

        selectChoices.push(new Choices(contactTypeSelect, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false
        }));
      }
      if(contact.type === 'Email') {
        contactTypeNew.classList.remove('is-hide');
        contactTypeSelect.innerHTML = `<option value="Phone">Телефон</option>
        <option value="Email" selected>Email</option>
        <option value="VK">Vk</option>
        <option value="FB">Facebook</option>
        <option value="Other">Другое</option>`;
        contactTypeInput.value = contact.value;

        selectChoices.push(new Choices(contactTypeSelect, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false
        }));
      }
      if(contact.type === 'VK') {
        contactTypeNew.classList.remove('is-hide');
        contactTypeSelect.innerHTML = `<option value="Phone">Телефон</option>
        <option value="Email">Email</option>
        <option value="VK" selected>Vk</option>
        <option value="FB">Facebook</option>
        <option value="Other">Другое</option>`;
        contactTypeInput.value = contact.value;

        selectChoices.push(new Choices(contactTypeSelect, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false
        }));
      }
      if(contact.type === 'FB') {
        contactTypeNew.classList.remove('is-hide');
        contactTypeSelect.innerHTML = `<option value="Phone">Телефон</option>
        <option value="Email">Email</option>
        <option value="VK">Vk</option>
        <option value="FB" selected>Facebook</option>
        <option value="Other">Другое</option>`;
        contactTypeInput.value = contact.value;

        selectChoices.push(new Choices(contactTypeSelect, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false
        }));
      }
      if(contact.type === 'Other') {
        contactTypeNew.classList.remove('is-hide');
        contactTypeSelect.innerHTML = `<option value="Phone">Телефон</option>
        <option value="Email">Email</option>
        <option value="VK">Vk</option>
        <option value="FB">Facebook</option>
        <option value="Other" selected>Другое</option>`;
        contactTypeInput.value = contact.value;

        selectChoices.push(new Choices(contactTypeSelect, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false
        }));
      }

      contactTypeNew.classList.add('is-view');
    })
  }
};

// added sort & tooltips in table
function clickTitleTable(field, arr, sortedField1, sortedField2, sortedField3) {
  const asc = field.dataset.asc === 'true' ? false : true;
  field.dataset.asc = asc;
  field.dataset.listener = true;
  titleTable.forEach(title => {
    title.classList.remove('thead__title--active');
  });
  field.classList.add('thead__title--active');
  sortedClients(arr, asc, sortedField1, sortedField2, sortedField3);
};

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
};

// created table clients
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
      };

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
      };
      tableBlock.append(tr);
    });
  } else {
    const p = document.createElement('p');
    p.classList.add('clients-not-found');
    p.innerHTML = `Нет данных`;

    if(notFoundClient === null) {
      container.insertBefore(p, mainBtn)
    };
  };

  const contactMore = document.querySelectorAll('.list__link--more');

  contactMore.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();

      const listContacts = el.parentElement.parentElement;
      const items = listContacts.querySelectorAll('.is-hide');
      items.forEach(item => {
        item.classList.remove('is-hide');
      })
      el.parentElement.classList.add('is-hide');
    });
  });

  addTooltipContacs();
  loadBlock.classList.remove('is-active');
  mainBtn.classList.remove('main__btn--load');
  tableBlock.style.height = '';
};

// created table clients
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
    return;
  }
  createClientsElements(sortClients);
};

// added table clients to page
async function createClients() {
  const loadPage = document.querySelector('.main__load');
  const tableBody = document.querySelector('.main__tbody');

  loadPage.classList.add('is-active');
  tableBody.classList.add('is-load');

  const strSearch = searchInput.value;
  const clients = await loadClientsSearch(strSearch);

  const clientHashId = window.location.hash.slice(window.location.hash.indexOf('=') + 1);

  if(clientHashId.length === 0) {
    sortedClients(clients);
    updateClientDBBtn();
  } else {
    sortedClients(clients);
    updateClientDB('', clientHashId);
    updateClientDBBtn();
  }

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

  deletedClientDBBtn();

  loadPage.classList.remove('is-active');
  tableBody.classList.remove('is-load');
};

// added client to db
function addClientDB() {
  const page = document.querySelector('.page__body');

  const btnAddClient = document.querySelector('.main__btn--load');
  const popupNew = document.querySelector('.popup-new');
  const popupNewWrap = popupNew.querySelector('.new__wrap');
  const popupAddClose = popupNew.querySelector('.new__close');
  const popupAddCancel = popupNew.querySelector('.new__cancel');
  const popupAddSave = popupNew.querySelector('.new__save');
  const popupAddError = popupNew.querySelector('.new__error');
  const popupAddInputs = popupNew.querySelectorAll('.new__input');

  function closePopupClick() {
    const validSurNameInput = popupNew.querySelector('.new__input--surname');
    const validNameInput = popupNew.querySelector('.new__input--name');
    const btnContacts = popupNew.querySelectorAll('.new__row-contact');

    validSurNameInput.classList.remove('is-invalid');
    validNameInput.classList.remove('is-invalid');
    btnContacts.forEach((el) => {
      el.classList.remove('is-invalid');
    });

    popupAddInputs.forEach(input => {
      if(input.getAttribute('value').length > 0) {
        input.setAttribute('value','');
        input.value = '';
      }
    })
    page.classList.remove('is-popup');
    popupNew.classList.remove('is-active');
    popupNewWrap.classList.remove('is-height');
    popupAddError.classList.remove('invalid');
  };

  async function saveClient() {
    popupNew.classList.add('is-load');
    console.log(popupNew);
    const validSurNameInput = popupNew.querySelector('.new__input--surname');
    const validNameInput = popupNew.querySelector('.new__input--name');
    const validMiddleNameInput = popupNew.querySelector('.new__input--middlename');
    const btnContacts = popupNew.querySelectorAll('.new__row-contact');

    validSurNameInput.classList.remove('is-invalid');
    validNameInput.classList.remove('is-invalid');
    btnContacts.forEach((el) => {
      el.classList.remove('is-invalid');
    });

    const validSurName = validSurNameInput.value.trim();
    const validName = validNameInput.value.trim();
    const validMiddleName = validMiddleNameInput.value.trim();

    const newSurName = capitalize(validSurName);
    const newName = capitalize(validName);
    const newMiddleName = capitalize(validMiddleName);

    const validForm = validFormCheck(popupNew, newSurName, newName);

    if(validForm.valid) {
      await addNewClient(newSurName, newName, newMiddleName, validForm.contactList);
      closePopupClick();
      createClients();
    } else {
      popupAddError.classList.add('invalid');

      if(validForm.errorInput === 'surname') {
        popupAddError.innerHTML = validForm.error;
        validSurNameInput.classList.add('is-invalid');
        return;
      }
      if(validForm.errorInput === 'name') {
        popupAddError.innerHTML = validForm.error;
        validNameInput.classList.add('is-invalid');
        return;
      }
      if(validForm.errorInput.length !== 0) {
        let errMessage = '';
        const btnContacts = popupNew.querySelectorAll('.new__row-contact.is-view');
        btnContacts.forEach((el, index) => {
          validForm.errorInput.forEach(err => {
            if(index == err) {
              el.classList.add('is-invalid');
            }
          })
        })
        validForm.error.forEach(err => {
          errMessage += `<p>${err}</p>`
        })
        popupAddError.innerHTML = errMessage;
        return;
      }
    };

    popupNew.classList.remove('is-load');
  };

  btnAddClient.addEventListener('click', e => {
    e.preventDefault();

    const validSurNameInput = popupNew.querySelector('.new__input--surname');
    const validNameInput = popupNew.querySelector('.new__input--name');
    const btnContacts = popupNew.querySelectorAll('.new__row-contact');

    const error = popupNew.querySelector('.new__error');

    validSurNameInput.addEventListener('input', () => {
      let timerId;
      clearTimeout(timerId);
      timerId = setTimeout(function() {
        validSurNameInput.classList.remove('is-invalid');
        error.classList.remove('invalid');
      }, 300);
    });

    validNameInput.addEventListener('input', () => {
      let timerId;
      clearTimeout(timerId);
      timerId = setTimeout(function() {
        validNameInput.classList.remove('is-invalid');
        error.classList.remove('invalid');
      }, 300);
    });

    btnContacts.forEach(input => {
      input.addEventListener('input', () => {
        let timerId;
        clearTimeout(timerId);
        timerId = setTimeout(function() {
          input.classList.remove('is-invalid');
          error.classList.remove('invalid');
        }, 300);
      });
    })

    page.classList.add('is-popup');
    popupNew.classList.add('is-active');

    popupAddInputs.forEach(input => {
      input.addEventListener('change', () => {
        input.setAttribute("value", input.value);
      })
    });

    addContactFieldNew();

    popupAddClose.addEventListener('click', closePopupClick);

    popupAddCancel.addEventListener('click', closePopupClick);

    popupNew.addEventListener('click', e => {
      e.preventDefault();
      if(e.target.classList.contains('popup-new')) {
        closePopupClick();
      }
    });

    popupAddSave.addEventListener('click', saveClient);
  });
};

// deleted client to db
function deletedClientDB(btn) {
  const page = document.querySelector('.page__body');
  const popupDelete = document.querySelector('.popup-delete');
  const clientDelete = btn.parentElement.parentElement;
  const clientId = clientDelete.querySelector('.tbody__title--id').innerHTML;
  const popupDeleteClose = popupDelete.querySelector('.delete__close');
  const popupDeleteCancel = popupDelete.querySelector('.delete__cancel');
  const popupDeleteDelete = popupDelete.querySelector('.delete__delete');

  async function deletedClientId() {
    await deletedClient(clientId);
    createClients();
    page.classList.remove('is-popup');
    popupDelete.classList.remove('is-active');
  }

  page.classList.add('is-popup');
  popupDelete.classList.add('is-active');

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

  popupDeleteDelete.addEventListener('click', deletedClientId);
};

function deletedClientDBBtn() {
  const btnDelete = document.querySelectorAll('.tbody__btn--delete');

  btnDelete.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();

      deletedClientDB(btn);
    });
  })
};

// updated client to db
async function updateClientDB(btn = '', clientId) {
  const page = document.querySelector('.page__body');

  const popupUpdate = document.querySelector('.popup-update');
  const updateSubtitle = popupUpdate.querySelector('.update__subtitle');
  const updateSurname = popupUpdate.querySelector('.update__input--surname');
  const updateName = popupUpdate.querySelector('.update__input--name');
  const updateMiddlename = popupUpdate.querySelector('.update__input--middlename');
  const popupAddSave = popupUpdate.querySelector('.update__save');
  const popupAddInputs = popupUpdate.querySelectorAll('.update__input');

  const validSurNameInput = popupUpdate.querySelector('.update__input--surname');
  const validNameInput = popupUpdate.querySelector('.update__input--name');
  const btnContacts = popupUpdate.querySelectorAll('.update__row-contact');

  validSurNameInput.classList.remove('is-invalid');
  validNameInput.classList.remove('is-invalid');
  btnContacts.forEach((el) => {
    el.classList.remove('is-invalid');
  });

  updateSubtitle.innerHTML = '';
  updateSurname.value = '';
  updateName.value = '';
  updateMiddlename.value = '';

  page.classList.add('is-popup');
  popupUpdate.classList.add('is-active');
  popupUpdate.classList.add('is-load');
  checkHeight();

  let client = '';

  if (clientId.length === 0) {
    const clientUpdate = btn.parentElement.parentElement;
    const clientUpdateId = clientUpdate.querySelector('.tbody__title--id').innerHTML;

    client = (await loadClient(clientUpdateId)).shift();
    window.location.hash = `?editClientId=${client.id}`;
  } else {
    client = (await loadClient(clientId)).shift();
  }

  addContactFieldUpdate(client.contacts);
  updateSubtitle.innerHTML = `ID: ${client.id}`;
  updateSurname.value = client.surname;
  updateName.value = client.name;
  updateMiddlename.value = client.middlename;
  popupUpdate.classList.remove('is-load');

  const btnContactDelete = popupUpdate.querySelectorAll('.update__row-contact.is-view .update__delete-contact');
  btnContactDelete.forEach(btn => {
    btn.addEventListener('click', () => {
      checkHeight();
      btn.parentElement.classList.add('is-hide');
      btn.parentElement.classList.remove('is-view');
      const input = btn.parentElement.querySelector('.update__value');
      input.value = '';
    })
  })

  checkHeight();

  const error = popupUpdate.querySelector('.update__error');

  validSurNameInput.addEventListener('input', () => {
    let timerId;
    clearTimeout(timerId);
    timerId = setTimeout(function() {
      validSurNameInput.classList.remove('is-invalid');
      error.classList.remove('invalid');
    }, 300);
  });

  validNameInput.addEventListener('input', () => {
    let timerId;
    clearTimeout(timerId);
    timerId = setTimeout(function() {
      validNameInput.classList.remove('is-invalid');
      error.classList.remove('invalid');
    }, 300);
  });

  btnContacts.forEach(input => {
    input.addEventListener('input', () => {
      let timerId;
      clearTimeout(timerId);
      timerId = setTimeout(function() {
        input.classList.remove('is-invalid');
        error.classList.remove('invalid');
      }, 300);
    });
  });

  const popupUpdateClose = popupUpdate.querySelector('.update__close');
  const popupUpdateDelete = popupUpdate.querySelector('.update__delete');
  const popupDelete = document.querySelector('.popup-delete');
  const popupAddError = popupUpdate.querySelector('.update__error');

  popupUpdateClose.addEventListener('click', e => {
    e.preventDefault();
    popupUpdate.classList.remove('is-active');
    page.classList.remove('is-popup');
    window.location.hash = '';
    closePopupClick();
  });

  popupUpdate.addEventListener('click', e => {
    e.preventDefault();
    if(e.target.classList.contains('popup-update')) {
      page.classList.remove('is-popup');
      popupUpdate.classList.remove('is-active');
      window.location.hash = '';
      closePopupClick();
    }
  });

  popupUpdateDelete.addEventListener('click', e => {
    popupUpdate.classList.remove('is-active');
    popupDelete.classList.add('is-active');
    window.location.hash = '';
    deletedClientDB(btn);
    closePopupClick();
  });

  function closePopupClick() {
    popupAddInputs.forEach(input => {
      if(input.getAttribute('value').length > 0) {
        input.setAttribute('value','');
        input.value = '';
      }
    })
    page.classList.remove('is-popup');
    popupUpdate.classList.remove('is-active');
    const newContact = document.querySelectorAll('.update__row-contact');

    newContact.forEach(el => {
      if(!el.classList.contains('is-hide')) {
        const newContactInput = el.querySelector('.update__value');
        el.classList.add('is-hide');
        el.classList.remove('is-view');
        newContactInput.value = '';
      }
    });

    popupAddError.classList.remove('invalid');

    client = '';
  };

  async function saveClientUpdate() {
    popupUpdate.classList.add('is-load');
    const validSurNameInput = popupUpdate.querySelector('.update__input--surname');
    const validNameInput = popupUpdate.querySelector('.update__input--name');
    const validMiddleNameInput = popupUpdate.querySelector('.update__input--middlename');
    const btnContacts = popupUpdate.querySelectorAll('.update__row-contact');

    validSurNameInput.classList.remove('is-invalid');
    validNameInput.classList.remove('is-invalid');
    btnContacts.forEach((el) => {
      el.classList.remove('is-invalid');
    });

    const validSurName = validSurNameInput.value.trim();
    const validName = validNameInput.value.trim();
    const validMiddleName = validMiddleNameInput.value.trim();

    const newSurName = capitalize(validSurName);
    const newName = capitalize(validName);
    const newMiddleName = capitalize(validMiddleName);

    const validForm = validFormCheck(popupUpdate, newSurName, newName);

    if(validForm.valid) {
      const clientUpdate = {
        "name": newName,
        "surname": newSurName,
        "middlename": newMiddleName,
        "contacts": validForm.contactList
      };

      await updatedClient(client.id, clientUpdate);
      window.location.hash = ``;
      closePopupClick();
      createClients();
    } else {
      popupAddError.classList.add('invalid');

      if(validForm.errorInput === 'surname') {
        popupAddError.innerHTML = validForm.error;
        validSurNameInput.classList.add('is-invalid');
        return;
      }
      if(validForm.errorInput === 'name') {
        popupAddError.innerHTML = validForm.error;
        validNameInput.classList.add('is-invalid');
        return;
      }
      if(validForm.errorInput.length !== 0) {
        let errMessage = '';
        const btnContacts = popupUpdate.querySelectorAll('.update__row-contact.is-view');
        btnContacts.forEach((el, index) => {
          validForm.errorInput.forEach(err => {
            if(index == err) {
              el.classList.add('is-invalid');
            }
          })
        })
        validForm.error.forEach(err => {
          errMessage += `<p>${err}</p>`
        })
        popupAddError.innerHTML = errMessage;
        return;
      }
    }

    popupAddSave.removeEventListener('click', saveClientUpdate);
  };

  popupAddSave.addEventListener('click', saveClientUpdate);
};

function updateClientDBBtn() {
  const btnsUpdate = document.querySelectorAll('.tbody__btn--update');
  btnsUpdate.forEach(btn => {
    btn.addEventListener('click', async () => {
      updateClientDB(btn, '');
    })
  });
};

// search clients in db
searchInput.addEventListener('input', e => {
  e.preventDefault();
  let timerId = setTimeout(async function() {
    const strSearch = searchInput.value;
    const clients = await loadClientsSearch(strSearch);

    const searchForm = document.querySelector('.header__form');
    const headerDropdown = document.querySelector('.header__dropdown') || document.createElement('div');

    headerDropdown.classList.add('header__dropdown');
    headerDropdown.innerHTML = '';

    if(clients.length > 0 && strSearch.length > 0) {
      headerDropdown.classList.add('is-active');
      clients.forEach(client => {
        const headerText = document.createElement('button');
        headerText.classList.add('header__text');
        headerText.innerHTML = `${client.surname} ${client.name} ${client.middlename}`;
        headerDropdown.append(headerText)
      })

      searchForm.append(headerDropdown);

      const dropdownList = document.querySelectorAll('.header__text');

      searchInput.addEventListener('keydown', function (event) {
        if(event.code === "ArrowDown") {
          dropdownList[0].focus();
        };

        if(event.code === "ArrowUp") {
          const length = dropdownList.length - 1;
          dropdownList[length].focus();
        };

        dropdownList.forEach((el, i) => {
          el.addEventListener('keydown', (e) => {
            if(e.code === "ArrowDown") {
              dropdownList.forEach((item, index) => {
                if(i === index) {
                  if(i < dropdownList.length - 1) {
                    dropdownList[++index].focus();
                  } else {
                    dropdownList[0].focus();
                  }
                }
              });
            };
          })
        });

        dropdownList.forEach((el, i) => {
          el.addEventListener('keydown', (e) => {
            if(e.code === "ArrowUp") {
              dropdownList.forEach((item, index) => {
                if(i === index) {
                  if(i > 0) {
                    dropdownList[--index].focus();
                  } else {
                    const length = dropdownList.length - 1;
                    dropdownList[length].focus();
                  }
                }
              });
            };
          })
        });
      });

      dropdownList.forEach(el => {
        el.addEventListener('click', () => {
          searchInput.value = el.innerHTML;
          headerDropdown.innerHTML = '';
          headerDropdown.classList.remove('is-active');
          loadPageClients();
        });

      });

    } else {
      headerDropdown.innerHTML = '';
      headerDropdown.classList.remove('is-active');
      loadPageClients();
    }

    searchInput.addEventListener('keydown', e => {
      if(e.code === 'Enter') {
        headerDropdown.innerHTML = '';
        headerDropdown.classList.remove('is-active');
        loadPageClients();
      }
    })

    clearTimeout(timerId);
  }, 300);
});

// main function page
function loadPageClients() {
  createClients();
  addClientDB();
};

loadPageClients();
