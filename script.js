let arr = [];

if (localStorage.arr) {
  arr = JSON.parse(localStorage.getItem("arr"));
  console.log(arr);
} else {
  fetch("https://6278f6ed6ac99a91066016a9.mockapi.io/API/pinterest")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      arr = data;
      console.log(arr);
      localStorage.setItem("arr", JSON.stringify(arr));
      render(arr);
      console.log(localStorage.getItem("arr"));
    });
}

function checker(check) {
  console.log(check);
}

let cardBlock = document.getElementById("cardBlock");
render(arr);
function isChecked(bool) {
  if (bool) {
    return "checked";
  } else {
    return "";
  }
}

//////////////////// ФУНКЦИЯ РЕНДЕР////////////////////////////////////////////////

function render(array) {
  cardBlock.innerHTML = "";
  array.forEach((el) => {
    let card = `
    <div class="card col-sm-6 col-md-3 col-lg-2">
          <div class="img-background" style="background-image: url(${
            el.picture
          })">
            <div class="checkbox">
              <input
                class="checker form-check-input m-0 rounded-circle"
                type="checkbox"
                ${isChecked(el.isChecked)}
                id="${"checkbox" + el.id}"
               
              onClick = "move(this.id)"
              />
              
            </div>
          </div>
          <div class="row d-flex flex-column m-0">
            <div class="col-4 avatar">
              <img
                src="${el.avatar_author}"
                alt=""
                class="img-avatar"
              />
            </div>
            <div class="col-8 name"><p class="m-0">${
              el.author_FirstName + " " + el.author_LastName
            }</p></div>
          </div>
        </div>`;

    cardBlock.innerHTML += card;
  });
  localStorage.setItem("arr", JSON.stringify(arr));
}

let desks = {
  desk1: [],
  desk2: [],
  desk3: [],
}; //////////////////// объект для досок

let modal = document.querySelector(".modal");

function move(a) {
  let id = a.slice(8);
  console.log(arr.find((x) => x.id == id).isChecked);

  if (!arr.find((x) => x.id == id).isChecked) {
    console.log("isChecked");

    modal.innerHTML = ` <div class="modal-content">
          <span class="close" onclick="closeModalByButton(modal)">&times;</span>

          <h1>Выберите действие</h1>

          <button
            type="button"
            class="btn-modal add_on_desk"
            id = "${"btn" + id}"
           onclick="(changeModal(this))"   
          >
            Добавить на доску
          </button>
          <button type="button" class="btn-modal delete">
            Скрыть пин со страницы
          </button>
          <button type="button" class="btn-modal complain">Пожаловаться</button>
        </div>`;

    startModal(modal);
  } else {
    modal.style.display = "none";
    let element = document.getElementById(a);

    console.log(element);
    element.removeAttribute("checked");
  }

  let myIndex = desks.desk1.indexOf(id);
  if (myIndex !== -1) {
    desks.desk1.splice(myIndex, 1);

    arr.find((x) => x.id == id).isChecked = false;
  }
} ////////////////////////////// пушем айдишки в массив

////////// ФУНКЦИЯ ЗАХВАТА ЗНАЧЕНИЯ В ИНПУТЕ И СОРТИРОВКИ ПО ХЭШТЭГУ ///////

let search = document.getElementById("search");

function searchHastags() {
  let val = search.value;
  console.log(val);

  let arrHashtags = [];

  arr.forEach((el) => {
    el.hashtag.split(" ").forEach((element) => {
      if (val == element) {
        arrHashtags.push(el);
      }
    });
  });

  if (val) {
    render(arrHashtags);
  } else {
    render(arr);
  }
}

search.addEventListener("change", searchHastags);

function renderFromDesk(arrDesk1) {
  let arrFromDesk1 = [];

  arrDesk1.forEach((element) => {
    arr.forEach((el) => {
      if (el.id == element) {
        arrFromDesk1.push(el);
      }
    });
  });

  render(arrFromDesk1);

  console.log(arrFromDesk1);
}

function status(state) {
  console.log(state);
  let arrIndex = state.split("_");
  console.log(arrIndex[0]);

  let status = desks[arrIndex[0]].find((item) => item == arrIndex[1]);

  if (status) {
    let myIndex = desks[arrIndex[0]].indexOf(arrIndex[1]);
    if (myIndex !== -1) {
      desks[arrIndex[0]].splice(myIndex, 1);

      arr.find((x) => x.id == arrIndex[1]).isChecked = false;
    }
  } else {
    desks[arrIndex[0]].push(arrIndex[1]);
    arr.find((x) => x.id == arrIndex[1]).isChecked = true;
  }
  console.log(desks[arrIndex[0]]);
}

//////////////// СКРИПТЫ ДЛЯ МОДАЛЬНОГО ОКНА ///////////////

function startModal(className) {
  className.style.display = "block";
}

function closeModalByButton(className) {
  className.style.display = "none";
}

function closeModalByWindow(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  } else if (event.target == modalWithDesks) {
    modalWithDesks.style.display = "none";
  }
}

window.addEventListener("click", closeModalByWindow);

//////// ФУНКЦИЯ СОЗДАНИЯ 2-ГО МОДАЛЬНОГО ОКНА

let modalWithDesks = document.querySelector(".modal_2");

function changeModal(x) {
  modal.style.display = "none";

  console.log(x);

  modalWithDesks.innerHTML = ` <div class="modal-content">
          <span class="close" onclick="closeModalByButton(modalWithDesks)">&times;</span>

          <h1>На какую доску добавить ?</h1>

          <button
            type="button"
            class="btn-modal add_on_desk1"
            id = "desk1_${x.id.slice(3)}"
            onclick="(status(this.id))"
          >
            На доску 1
          </button>

          <button
            type="button"
            class="btn-modal add_on_desk2"
          id = "desk2_${x.id.slice(3)}"
          onclick="(status(this.id))"
          >
            На доску 2
          </button>

          <button
            type="button"
            class="btn-modal add_on_desk3"
           id = "desk3_${x.id.slice(3)}"
           onclick="(status(this.id))"
          >
            На доску 3
          </button>

        </div>`;

  modalWithDesks.style.display = "block";
}
