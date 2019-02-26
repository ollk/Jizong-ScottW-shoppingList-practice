'use strict';
/*global cuid*/

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false,},
    {id: cuid(), name: 'oranges', checked: false,},
    {id: cuid(), name: 'milk', checked: true,},
    {id: cuid(), name: 'bread', checked: false,}
  ],
  hideCompleted: false,
};


function generateItemElement(item) {
  return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
}

function renderShoppingList(searchItems) {
  let filteredItems = STORE.items;
  if (searchItems) {
    filteredItems = searchItems;
  }
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToStore(name) {
  return STORE.items.push({id: cuid(), name: name, checked: false, searched: false,});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    if (newItemName === '') {return;}
    $('.js-shopping-list-entry').val('');
    addItemToStore(newItemName);
    renderShoppingList(STORE.items);
  });
}

function toggleItemCheckStatus(id) {
  let foundItem = STORE.items.find(item => item.id === id );
  foundItem.checked = !foundItem.checked;
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', function(event) {
    let itemId = $(this).closest('li').data('item-id');
    toggleItemCheckStatus(itemId);
    renderShoppingList();
  });
}

function deleteItem(id) {
  let foundItemIndex = STORE.items.findIndex(item => item.id === id);
  STORE.items.splice(foundItemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', function(event) {
    let itemId = $(this).closest('li').data('item-id');
    deleteItem(itemId);
    renderShoppingList();
  });
}

function toggleHideFilter() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').click(function(){
    toggleHideFilter();
    renderShoppingList();
  });
}

//Model
function filterBySearch(name) {
  const searchItems = STORE.items;
  return searchItems.filter(item => item.name.includes(name));
}

//Controller
function handleSearchItems() {
  $('#js-search-form').submit(function(event){
    event.preventDefault();
    const searchEntry = $('.js-search-entry').val();
    const searchItems = filterBySearch(searchEntry);
    renderShoppingList(searchItems);
    console.log('searching');
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handleSearchItems();
}

$(handleShoppingList);