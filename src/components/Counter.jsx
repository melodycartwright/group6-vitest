import {useState} from 'react'
const Counter=()=>{
    //skapar ett variabelantal som börjar på 0, och setCount är funktionen vi använder för att uppdatera det värdet
    const[count,setCount]=useState(0)


//      Denna funktion körs när du klickar på knappen. Den ökar antalet med 1 med föregående värde (föregående).              
    const handleClick=()=>{
        setCount(prev=>prev+1)
    }
    //rendera  för att visa räknaren och en knapp för att utlösa handleClick. Data-testid hjälper oss att hitta elementet i tester
    return(
        <div>
            <p data-testid="count-value">Current count {count}</p>
            <button onClick={handleClick}>Öka</button>
        </div>
    )
}
export default Counter;