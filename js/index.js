function loadDocument(){
    //Declatations
    const form = document.querySelector('#cryptoForm')
    const selectCurrency = document.querySelector('#currency')
    const selectCrypto = document.querySelector('#crypto')
    const result = document.querySelector('#result')
    let cryptoObj = 
    {
        currency:"",
        crypto:""
    }
    
    //EventListeners
    form.addEventListener('submit',Validation)
    selectCurrency.addEventListener('change',readField)
    selectCrypto.addEventListener('change',readField)

    //FetchApis
    queryCrypto() //Call to fill the crypto select

    const getCryptocurrency = cryptocurrency=> new Promise(resolve=>{resolve(cryptocurrency)})

    function queryCrypto(){
        const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'
        fetch(url)
            .then(answer=> answer.json())
            .then(cryptocurrency => getCryptocurrency(cryptocurrency))
            .then(result=> fillCrypto(result))
    }

    function getQuote(){
        const {currency, crypto} = cryptoObj
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${currency}`
        
        showSpinner()

        fetch(url)
            .then(answer=> answer.json())
            .then(result => showQuote(result.DISPLAY[crypto][currency]))
    }
    //Functions

    function readField(e){
        cryptoObj[e.target.name] = e.target.value
    }

    function Validation(e){
        e.preventDefault()
        const{currency, crypto} = cryptoObj
        if(currency === "" || crypto === ""){
            showAlert('Field are mandatory')
            return;
        }

        getQuote()
    }

    function fillCrypto(cryptos){
       cryptos.Data.forEach(crypto => {
        const{FullName, Name} = crypto.CoinInfo
        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;
        selectCrypto.appendChild(option)
       });
        
    }

    function showQuote(quoteInfo){
        clearHTML()

        const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = quoteInfo;
       
        const price = document.createElement('p');
        price.classList.add('text-2xl', 'font-bold', 'mb-3');
        price.innerHTML = `The Price is: <span>${PRICE}</span>`

        const highDay = document.createElement('p');
        highDay.innerHTML = `<p class="mb-3">The Highest price of the day is: <span class= "font-bold">${HIGHDAY}</span>`

        const lowDay = document.createElement('p');
        lowDay.innerHTML = `<p class="mb-3">The Lowest price of the day is: <span class= "font-bold">${LOWDAY}</span>`

        const lastHours = document.createElement('p');
        lastHours.innerHTML = `<p class="mb-3">Variation Last 24 hours <span class= "font-bold">${CHANGEPCT24HOUR} %</span>`

        const lastUpdate = document.createElement('p');
        lastUpdate.innerHTML = `<p class="mb-3">Last Update: <span class= "font-bold">${LASTUPDATE}</span>`

        result.appendChild(price)
        result.appendChild(highDay)
        result.appendChild(lowDay)
        result.appendChild(lastHours)
        result.appendChild(lastUpdate)
    }
    
    function clearHTML(){
        while(result.firstChild){
            result.removeChild(result.firstChild)
        }
    }

    function showSpinner(){
        clearHTML() 
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');

        spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
        `;

        result.appendChild(spinner)
    }

    function showAlert(messege) {
        const existAlert = document.querySelector('.error');
        if (!existAlert) {
            const alert = document.createElement('DIV')
            alert.className ='text-center font-bold p-4 bg-red-300 border border-red-700'
            alert.innerHTML = `
            <p>Error!</p>
            <p>${messege}</p>
        
        `
            result.appendChild(alert)
    
            setTimeout(() => {
                alert.remove()
            }, 3000);
        }
    
    }
}


document.addEventListener('DOMContentLoaded',()=>{
    loadDocument();
    
})