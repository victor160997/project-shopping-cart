function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
 */
const createListItens = async () => {
  const items = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const products = await items.json();
  return products.results;
};
  
const selectItem = async (id) => {
  const item = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const products = await item.json();
  return products;
};

let total = 0;
const totalPrice = document.createElement('p');
const createTotalPrice = async (theTotal) => {
  totalPrice.className = 'total-price';
  totalPrice.innerText = `${theTotal}`;
  document.querySelector('.cart').appendChild(totalPrice);
};

function cartItemClickListener(event) {
  const theCar = document.querySelector('.cart__items');
  const array = event.target.innerText.split('');
  let number;
  array.forEach((a, b) => {
    if (a === '$') {
      const array2 = [];
      for (let index = b + 1; index <= array.length; index += 1) {
        array2.push(array[index]);
      }
      number = parseFloat(array2.join(''));
    }
    });
  total -= number;
  createTotalPrice(total);
  theCar.removeChild(event.target);
}

function createCartItemElement({ id, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  total += salePrice;
  createTotalPrice(total);
  return li;
}

window.onload = async () => { 
  const theCar = document.querySelector('.cart__items');
  const arrayProducts = await createListItens();
  const paiList = document.querySelector('.items');
  async function adcCarListener(event) {
    const id = event.target.parentElement.firstElementChild.innerText;
    theCar.appendChild(createCartItemElement(await selectItem(id)));
  }
  arrayProducts.forEach((product) => {
    paiList.appendChild(createProductItemElement(product))
    .lastElementChild.addEventListener('click', adcCarListener);
  });
  const clearCar = async () => {
    document.querySelectorAll('.cart__item').forEach((item) => theCar.removeChild(item));
    await createTotalPrice(0);
  };
  document.querySelector('.empty-cart').addEventListener('click', await clearCar);
};
