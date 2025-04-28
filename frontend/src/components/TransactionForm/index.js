import { useState } from "react"

const TransactionForm = () => {
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState("")
    const [description, setDescription] = useState("")

    const onSubmitForm = async (event) => {
        event.preventDefault()

        const url = "https://finance-visualizer-ihrs.onrender.com/transactions"
        const data = {
            amount, date, description
        }
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }

        try{
            const response = await fetch(url, options)
            if (!response.ok){
                throw new Error("Failed to add Transaction")
            }

            const result = await response.json()
            console.log("Transaction is added successfully")

            setAmount("")
            setDate("")
            setDescription("")
        }
        catch(error){
            console.log("Error")
        }
        
    }

    return (
        <div className="form-container">
            <h4 className="add-transaction-heading">Add Transaction</h4>
            <form className="form" onSubmit={onSubmitForm}>
                <label className="label" htmlFor="amount">Amount</label>
                <input className="input" type="text" id="amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
                <label className="label" htmlFor="date">Date</label>
                <input className="input" type="text" id="date" value={date} onChange={(event) => setDate(event.target.value)} />
                <label className="label" htmlFor="description">Description</label>
                <input className="input" type="text" id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
                <button className="add-button" type="submit">Add</button>
            </form>
        </div>
    )
}

export default TransactionForm