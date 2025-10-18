import './App.css'
import axios from 'axios'
import { currencies } from "./currensies";
import { useEffect, useState } from 'react';

function App() {

  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmout] = useState(0);
  const [selectCureency, setSelectedCurrency] = useState("INR");
  const [conversionHistory, setConversationHistory] = useState([]);

  useEffect(() => {

    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setConversationHistory(savedHistory);

  }, []);

  const savedHistory = (entry) => {
    const updatedHistory = [entry, ...conversionHistory];
    setConversationHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  }

  const ConvertCurrencys = async () => {

    try {
      const { data } = await axios.get(`http://localhost:4000/convert?base_currency=${baseCurrency}&currency=${selectCureency}`);


      const rate = data?.data?.[selectCureency]?.value;

      console.log(rate);
      let roundofResult = (rate * amount).toFixed(2);
      const curentycode = currencies.find(currency => currency.code === selectCureency);
      savedHistory({
        result: roundofResult,
        flag: curentycode.flag,
        symbol: curentycode.symbol,
        coutryName: curentycode.name,
        date: new Date().toLocaleString
      })

      //console.log(data);
    } catch (error) {
      alert("Error fetching converstion rate")
    }
  }


  const deleteHistoryItem = (index) => {
    const updatedHistory = conversionHistory.filter((_, i) => i !== index);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setConversationHistory(updatedHistory)
  }


  return (
    <>
      <div className='h-screen bg-gradient-to-r py-8 from-blue-500 to-purple-600 items-center justify-end px-5 md:px-10 '>
        <div className='bg-white p-6 rounded-lg shadow-me mx-auto w-full max-w-[500px] h-full overflow-hidden'>
          <h1 className='text-3xl font-bold text-gray-800 mb-6 overflow-hidden text-center'>Smart Currency Converter</h1>


          <div className='mb-4 px-1'>
            <label className='block text-gray-700 '>Base Currency</label>
            <select className='w-full border-gray-300 bg-gray-200 font-semibold text-xl rounded-lg p-3 my-2' value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>

              {
                currencies.map(element => {
                  return (
                    <option key={element.code} value={element.code}>{element.name}</option>
                  )
                })
              }

            </select>

          </div>

          <div className='mb-4 px-1'>
            <label className='block text-gray-700 '>Amount</label>
            <input value={amount} onChange={(e) => setAmout(e.target.value)} type="text" className='w-full border-gray-300 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-2' />
          </div>

          <div className='flex justify-end'>
            <button className='bg-red-500 text-white rounded-lg font-semibold text-xl py-2 w-45 transition-all duration-300 hover:bg-red-700 cursor-pointer' onClick={ConvertCurrencys}>Convert</button>
          </div>

          <div className='mb-4 px-1'>
            <label className='block text-gray-700 '>Currency to Convert</label>
            <select className='w-full border-gray-300 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-2' value={selectCureency} onChange={(e) => setSelectedCurrency(e.target.value)}>

              {
                currencies.map(element => {
                  return (
                    <option key={element.code} value={element.code}>{element.name}</option>
                  )
                })
              }

            </select>
          </div>

          <div className='mt-6 px-1 '>
            <h2 className='text-xl px-1 font-bold text-gray-800 mb-4'>Conversion History</h2>
          </div>

          <div className='px-1 h-[400px] overflow-scroll'>
            <ul className='p-1'>
              {conversionHistory.map((element, index) => (
                <li key={index} className='text-gray-700 mb-4 flex items-center justify-between'>
                  <div className='flex items-center'>
                    <img
                      src={`https://flagcdn.com/16x12/${element.flag}.png`}
                      alt="country flag"
                      className='w-2 h-2'
                    />
                    <p className='flex flex-col gap-1 text-gray-500 font-medium ml-2'>
                      <span className='text-xl font-semibold text-black'>
                        {element?.symbol} {element?.result}
                      </span>
                      <span className='text-xl font-semibold text-black'>
                        {element?.countryName}
                      </span>
                    </p>
                  </div>
                  <span
                    onClick={() => deleteHistoryItem(index)}
                    className='text-gray-500 font-bold text-xl cursor-pointer'
                  >
                    X
                  </span>
                </li>
              ))}
            </ul>


          </div>





        </div>
      </div>

    </>
  )
}

export default App
