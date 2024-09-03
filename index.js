let transactionsArray = []

let balanceDiv = document.createElement('div')
document.getElementById('historyArea').appendChild(balanceDiv)



let transactionList = function (backData){

    let transactionAlert = document.createElement('span')
    transactionAlert = `NEW TRANSACTION:`

    let nameHeader = document.createElement('span')
    nameHeader.id = `name-${backData.name}`
    nameHeader.innerText = `Transaction name: ${backData.name}`

    let valueHeader = document.createElement('span')
    valueHeader.id = `value-${backData.value}`
    valueHeader.innerText = `Transaction amount: ${backData.value}`

    let editButton = document.createElement('button')
    editButton.type = "button"
    editButton.innerText = "Edit"
    editButton.id = `${backData.id}`
    editButton.addEventListener('click',editButtonFunctionality)

    let divCreated = document.createElement('div')
    divCreated.classList.add('transDiv')
    divCreated.id = `id-${backData.id}`
    divCreated.append(transactionAlert,nameHeader,valueHeader,editButton)

    let article = document.getElementById('historyArea')
    article.appendChild(divCreated)
}

let backEndFetch = async function(){
    const response = await fetch('http://localhost:3000/transactions').then(res => res.json()) 
    transactionsArray = [...response]
    transactionsArray.forEach(transactionList)
}

let editButtonFunctionality = function(ev){
    let bttnID = ev.target.id

    let transID = transactionsArray.find(element => element.id === bttnID)
    document.getElementById('transactionName').value = transID.name
    document.getElementById('transactionValue').value = transID.value
}

let showBalance = async function(){
    const response = await fetch('http://localhost:3000/transactions').then(res => res.json())    
    
   let balance = response.reduce(function(initValue,element){
        return initValue+ Number(element.value)
    },0)
    
    balanceDiv.innerText = balance
}

document.addEventListener('DOMContentLoaded',()=>{
    backEndFetch()
    showBalance()
})

let formsPost= document.getElementById('formsPost')
formsPost.addEventListener('submit',async (ev)=>{
    
    ev.preventDefault()
    let newTrans= {       
        name: document.getElementById('transactionName').value,
        value: document.getElementById('transactionValue').value
    }

    const response = await fetch('http://localhost:3000/transactions',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTrans)
    }).then(res => res.json())
     
    transactionList(response)
    transactionsArray.push(response)
    showBalance()
    formsPost.reset()
}
)

