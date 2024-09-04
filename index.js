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

    let removeButton = document.createElement('button')
    removeButton.type = "button"
    removeButton.innerText = "Delete"
    removeButton.id = `remove-${backData.id}`
    removeButton.addEventListener('click',removeButtonFunctionality)

    let divCreated = document.createElement('div')
    divCreated.classList.add('transDiv')
    divCreated.id = `id-${backData.id}`
    divCreated.append(transactionAlert,nameHeader,valueHeader,editButton, removeButton)

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
    document.getElementById('transactionID').value = transID.id
    document.getElementById('transactionName').value = transID.name
    document.getElementById('transactionValue').value = transID.value
}

let removeButtonFunctionality = async function(ev){
    let referredDiv = ev.target.parentNode
    referredDiv.remove()
    let removeBttnID = ev.target.id
    let soloID = removeBttnID.slice(7)
    let indexRemove = transactionsArray.indexOf(element => element.id === soloID)
    transactionsArray.splice(indexRemove,1)
    const response = await fetch (`http://localhost:3000/transactions/${soloID}`,{method:'DELETE'})
    showBalance()
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

let forms= document.getElementById('forms')
forms.addEventListener('submit',async (ev)=>{
    
    ev.preventDefault()
    let infosTrans= {       
        name: document.getElementById('transactionName').value,
        value: document.getElementById('transactionValue').value
    }

    let transIdValue = document.getElementById('transactionID').value
    let checkID = transactionsArray.find(element => element.id === transIdValue)

    if(checkID){
        const response = await fetch(`http://localhost:3000/transactions/${transIdValue}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(infosTrans)
        }).then(res => res.json())
        let indexReplace = transactionsArray.indexOf(checkID)
         transactionsArray.splice(indexReplace,1,response)
        document.getElementById(`id-${transIdValue}`).remove()
        transactionList(response)
    } else{
        const response = await fetch('http://localhost:3000/transactions',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(infosTrans)
        }).then(res => res.json())
        transactionsArray.push(response)
        transactionList(response)
    }
    
    showBalance()
    forms.reset()
}
)

