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
  return products;
};
  
const selectItem = async (id) => {
  const item = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const products = await item.json();
  return products;
};

function cartItemClickListener(event) {
  console.log(event.target);
}

function createCartItemElement({ id, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = async () => { 
  async function adcCarListener(event) {
    const id = event.target.parentElement.firstElementChild.innerText;
    const theSelected = await selectItem(id);
    const theCar = document.querySelector('.cart__items');
    theCar.appendChild(createCartItemElement(theSelected));
  }
  const products = await createListItens();
  const arrayProducts = products.results;
  const paiList = document.querySelector('.items');
  arrayProducts.forEach((product) => {
    paiList.appendChild(createProductItemElement(product))
    .lastElementChild.addEventListener('click', adcCarListener);
  });
};