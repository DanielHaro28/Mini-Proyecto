

function generadorBotones() {
    let buttonsHTML = 'abcdefghijklmnñopqrstuvwxyz'.split('').map(letter =>
        `
        <button 
        class="btn btn-lg btn-primary m-2" 
        id='` + letter + `' 
        onClick="handleGuess('` + letter + `')">
        
        ` + letter + `
        
        
        </button>  
        `
    ).join('');
    document.getElementById('teclado').innerHTML = buttonsHTML;
}
generadorBotones();