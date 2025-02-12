import React, { useState, useEffect } from "react";
import axios from "axios";
import withTheme from '../../hocs/withTheme';
import Dark from '../../support/Dark.png';
import Light from '../../support/Light.png';

interface Transaction {
  transaction_id: number;
  product: string;
  status: string;
  total_price: string;
}

interface OrderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Revenue: React.FC<OrderProps> = ({ isDarkMode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://vicious-damara-gentaproject-0a193137.koyeb.app/transaction/seller",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTransactions(response.data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount: string) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    return formatter.format(Number(amount));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`w-full min-h-screen ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`}
    style={{
      backgroundImage: `url(${isDarkMode ? Dark : Light})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-black pt-[50px]">Revenue</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-black">
            <thead className="bg-[#40b446]">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Transaction ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Product</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.transaction_id}
                  className={`hover:bg-[#40b446] transition duration-150 ${isDarkMode ? 'bg-[#888888]' : 'bg-white'}`}
                >
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {transaction.transaction_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {transaction.product}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 capitalize text-black">
                    {transaction.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {formatCurrency(transaction.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withTheme(Revenue);