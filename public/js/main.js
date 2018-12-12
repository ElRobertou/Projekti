'use strict';

console.log(document.cookie);
const userID = document.cookie.split('=')[1];
console.log('userID is', userID);

const list = document.querySelector('#kuvalista');
const omalista = document.querySelector('#omatkuvat');
const modInput = document.querySelector('#kommentti input');

const avaaModal = (image) => {
  modInput.value = image.mID;
};

const getImages = () => {
  fetch('/images').then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    // clear list before adding upated data
    list.innerHTML = '';
    json.forEach((image) => {
      const div = document.createElement('div');
      const img = document.createElement('img');
      img.src = 'uploads/' + image.polku;
      const title = document.createElement('h4');
      const kommentit = document.createElement('div');
      title.innerHTML = image.teksti;
      img.addEventListener('click', () => {
        avaaModal(image);
      });
      div.appendChild(img);
      div.appendChild(title);
      list.appendChild(div);
      kommentit.innerHTML = '<form id="kommentti" action="./kommentoi" method="post">\n' +
          '            <input type="hidden" name="mID" value="' + image.mID +
          '">\n' +
          '            <br>\n' +
          '            <textarea name="k_teksti" style="width: 35%"></textarea>\n' +
          '            <br>\n' +
          '            <button type="submit">Kommentoi</button>\n' +
          '        </form>';
      getKommentti(image.mID, kommentit);

      list.appendChild(kommentit);
    });
  });
};

const getMyImages = () => {
  fetch('/images/x').then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    // clear list before adding updated data
    omalista.innerHTML = '';
    json.forEach((image) => {
      const odiv = document.createElement('div');
      const oimg = document.createElement('img');
      oimg.src = 'uploads/' + image.polku;
      const otitle = document.createElement('h4');
      const okommentit = document.createElement('div');
      otitle.innerHTML = image.teksti;
      odiv.appendChild(oimg);
      const a = document.createElement('a');
      a.innerText = 'Poista kuva';
      a.setAttribute('href', '/images/' + image.mID);
      a.addEventListener('click', (evt) => {
        evt.preventDefault();
        const url = evt.target.href;
        const settings = {
          method: 'delete',
        };
        fetch(url, settings).then((response) => {
          return response.json();
        }).then((json) => {
          console.log(json);
          getImages();
        });
      });
      odiv.appendChild(otitle);
      odiv.appendChild(a);
      omalista.appendChild(odiv);
      okommentit.innerHTML = '<form id="kommentti" action="./kommentoi" method="post">\n' +
          '            <input type="hidden" name="mID" value="' + image.mID +
          '">\n' +
          '            <br>\n' +
          '            <textarea name="k_teksti"></textarea>\n' +
          '            <br>\n' +
          '            <button type="submit">Kommentoi</button>\n' +
          '        </form>';
      getKommentti(image.mID, okommentit);

      omalista.appendChild(okommentit);
    });
  });
};

const getKommentti = (id, elem) => {
  fetch('/kommentit/' + id).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    // clear list before adding upated data
    // list.innerHTML = '';
    json.forEach((jotain) => {
      const kdiv = document.createElement('div');
      const ktitle = document.createElement('p');
      ktitle.innerHTML = jotain.k_teksti;
      kdiv.appendChild(ktitle);
      elem.appendChild(kdiv);
    });
  });
};

getImages();
getMyImages();