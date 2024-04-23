import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { Api } from "./Api";
import { useNavigate } from "react-router-dom";
import { TransactionsCard } from "./transactioncard";
import { FormattedDate } from "./FormattedDate";

export const Transactions = () => {
    const navigate = useNavigate();
    const [transactionsSaved, setTransactionsSaved] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [totalSpending, setTotalSpending] = useState(0);
    const [year, setYear] = useState(new Date().getFullYear());
    const [orderByColumn, setOrderByColumn] = useState('date');
    const [orderBy, setOrderBy] = useState('DESC');

    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        async function getTransactionsByMonth() {
            try {
                if (isNaN(year) || isNaN(month)) {
                    console.error('Invalid year or month:', year, month);
                    return;
                }

                const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
                const endDate = `${year}-${String(month).padStart(2, '0')}-30`;

                const transactions = await Api.getTransactions(startDate, endDate, orderByColumn, orderBy);

                const validTransactions = transactions.filter(t =>
                    parseFloat(t.amount) > 0 &&
                    t.category.toLowerCase().indexOf('transfer') === -1
                ).map(t => ({
                    ...t,
                    amount: parseFloat(t.amount).toFixed(2)
                }));

                setTransactionsSaved(transactions);
                setTotalSpending(validTransactions.reduce((total, t) => total + parseFloat(t.amount), 0).toFixed(2));
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.log('Too many requests. Retrying after 5 seconds...');
                    setTimeout(() => {
                        getTransactionsByMonth();
                    }, 5000);
                } else {
                    console.log("There was an error getting transactions", error);
                }
            }
        }
        getTransactionsByMonth();
    }, [currentUser, year, month, orderByColumn, orderBy]);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    const handleMonthChange = (e) => {
        const selectedMonth = parseInt(e.target.value, 10);
        setMonth(selectedMonth);
    };

    const handleYearChange = (e) => {
        const selectedYear = parseInt(e.target.value, 10);
        setYear(selectedYear);
    };

    const handleOrderByChange = (e) => {
        setOrderBy(e.target.value);
    };

    const handleOrderByColumnChange = (e) => {
        setOrderByColumn(e.target.value);
    };

    return (
        <div className="p-6  mt-16">
            <h1 className="text-2xl font-bold mb-4">Transactions for {currentUser.user.username}</h1>


            <div className="select-container">
                <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Select Month:</span>
                    </label>
                    <select id="month" className="select select-bordered" value={month} onChange={handleMonthChange}>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>

                    <label className="label">
                        <span className="label-text">Select Year:</span>
                    </label>
                    <select id="year" className="select select-bordered" value={year} onChange={handleYearChange}>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Order By Column:</span>
                    </label>
                    <select id="orderByColumn" className="select select-bordered" value={orderByColumn} onChange={handleOrderByColumnChange}>
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="merchant_name">Merchant Name</option>
                    </select>

                    <label className="label">
                        <span className="label-text">Order By:</span>
                    </label>
                    <select id="orderBy" className="select select-bordered" value={orderBy} onChange={handleOrderByChange}>
                        <option value="DESC">Descending</option>
                        <option value="ASC">Ascending</option>
                    </select>
                </div>
            </div>







            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionsSaved.map(t => (
                            <tr key={t.transaction_id}>
                                <td className="border px-4 py-2">{t.merchant_name === null ? t.category : t.merchant_name}</td>
                                <td className="border px-4 py-2">${parseFloat(t.amount).toFixed(2)}</td>
                                <td className="border px-4 py-2">{FormattedDate(t.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                Total spending the month: ${isNaN(totalSpending) ? '0.00' : totalSpending}
            </div>
        </div>
    );
}