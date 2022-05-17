//identificar y definir el estado de la app
var state = {
  balance: 0,
  income: 0,
  expense: 0,
  transactions: [
    // {id:uniqueId(), name:'sueldo',amount: 800000,type: 'income' },
    // {id:uniqueId(), name:'Pago tarjeta', amount: 150000, type:'expense'},
    // {id:uniqueId(), name:'supermarket shoppings', amount: 80000, type:'expense'},
    // {id:uniqueId(), name:'transferencia lila', amount: 125000, type:'expense'},
    // {id:uniqueId(), name:'devolucion repuestos', amount: 700000, type:'income'
  ]
}

//variables para interactuar
var balanceEl = document.querySelector('#balance');
var incomeEl = document.querySelector('#income');
var expenseEl = document.querySelector('#expense');
var transactionsEl = document.querySelector('#transaction');
var incomeBtnEl = document.querySelector('#incomeBtn');
var expenseBtnEl = document.querySelector('#expenseBtn');
var nameInputEl = document.querySelector('#name');
var amountInputEl = document.querySelector('#amount');

//hacer qeu los valores sean dinamicos con JS y no rigidos en html
function init() {
  var localState = JSON.parse(localStorage.getItem('expenseTrackerState'));
  if(localState !== null){
    state = localState;
  }
  updateState();
  initListeners();
}

function uniqueId(){
  return Math.round(Math.random() * 100000);
}

function initListeners() {
  incomeBtnEl.addEventListener('click', onAddIncomeClick);
  expenseBtnEl.addEventListener('click', onAddExpenseClick);
}

function onAddIncomeClick() {
  addTransaction(nameInputEl.value, amountInputEl.value, 'income');
}

function addTransaction(name, amount, type){
  if (name !== '' && amount !== '') {
    var transaction = { // {id: uniqueId, name:'sueldo', amount: 800000, type:'income'}
      id:uniqueId(),
      name: name,
      amount: parseInt(amount),
      type: type
    };
    // console.log(state);
    state.transactions.push(transaction);
    updateState();

  } else {
    alert("Datos invalidos, Porfavor ingrese descripcion y monto")
  }
  nameInputEl.value = '';
  amountInputEl.value = '';
}

function onAddExpenseClick() {
  addTransaction(nameInputEl.value, amountInputEl.value, 'expense');
  /*lo mismo que arriba pero DO NOT REPEAT YOURSELF codigo
  limpio llamar una funcion es mejor qeu repetir codigo

  var name = nameInputEl.value;
  var amount = amountInputEl.value;

  if (name !== '' && amount !== '') {
    var transaction = {
      name: nameInputEl.value,
      amount: parseInt(amountInputEl.value),
      type: "expense"
    };
    console.log(state);
    state.transactions.push(transaction);
    updateState();

  }else {
    alert("Porfavor ingrese descripcion y monto del cargo")
  }
  */
}

function onDeleteClick(event){
  var id = parseInt(event.target.getAttribute('data-id'));
  var deleteIndex;

  for(var i = 0; i < state.transactions.length; i++){
    if(state.transactions[i].id === id){
      deleteIndex = i;
      break;
    }
  }
  state.transactions.splice(deleteIndex, 1);
  updateState();
}

function updateState() {
  var balance = 0,
      income = 0,
      expense = 0,
      item;
  for (var i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];

    if (item.type === 'income') {
      income += item.amount;
    } else if (item.type === 'expense') {
      expense += item.amount;
    }
  }
  balance = income - expense;
  console.log(balance, income, expense)
  state.balance = balance;
  state.income = income;
  state.expense = expense;

  localStorage.setItem('expenseTrackerState', JSON.stringify(state));

  render();
}

function render() {
  balanceEl.innerHTML = `$${state.balance}`;
  incomeEl.innerHTML = `$${state.income}`;
  expenseEl.innerHTML = `$${state.expense}`;

  var transactionEl, containerEl, amountEl, item, btnEl;

  //antes de renderizar tengo que borrar lo que trae la ul dentro
  transactionsEl.innerHTML = '';

  //entonces ahora creo el ciclo para la nueva creacion de elementos el la ul
  for (var i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];
    transactionEl = document.createElement('li');
    transactionEl.append(item.name);

    transactionsEl.appendChild(transactionEl);

    containerEl = document.createElement('div');
    amountEl = document.createElement('span');
    if (item.type === 'income') {
      amountEl.classList.add('income-amt');
    } else if (item.type === 'expense') {
      amountEl.classList.add('expense-amt');
    }
    amountEl.innerHTML = `$${item.amount}`;

    containerEl.appendChild(amountEl);

    btnEl = document.createElement('button');
    btnEl.setAttribute('data-id', item.id);
    btnEl.innerHTML = 'x';

    btnEl.addEventListener('click', onDeleteClick);

    containerEl.appendChild(btnEl);

    transactionEl.appendChild(containerEl);
  }
}

init();