import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { Api } from "./Api";
import { Chart, ArcElement } from 'chart.js';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

Chart.register(ArcElement);

export const InVOut = () => {
    const { currentUser, balances } = useContext(UserContext);
    const [totalDeposits, setTotalDeposits] = useState(null);
    const [totalSpending, setTotalSpending] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!currentUser || !balances) {
                    setIsLoading(true);
                    return;
                }

                const currentDate = new Date();
                const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
                const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

                const transactions = await Api.getTransactions(startDate, endDate, "date", "DESC");

                const deposits = transactions.filter(t =>
                    parseFloat(t.amount) < 0 &&
                    (t.category.toLowerCase().split(',').map(c => c.trim()).includes('deposit') ||
                        t.category.toLowerCase().split(',').map(c => c.trim()).includes('payroll') ||
                        t.category.toLowerCase().split(',').map(c => c.trim()).includes('refund'))
                );

                const spending = transactions.filter(t =>
                    parseFloat(t.amount) > 0 && t.category.toLowerCase().indexOf('deposit') === -1 && t.category.toLowerCase().indexOf('transfer') === -1
                );

                const totalDepositAmount = deposits.reduce((acc, t) => acc - parseFloat(t.amount), 0);
                const totalSpendingAmount = spending.reduce((acc, t) => acc + parseFloat(t.amount), 0);

                setTotalDeposits(totalDepositAmount.toFixed(2));
                setTotalSpending(totalSpendingAmount.toFixed(2));

                const totalIncome = parseFloat(totalDeposits);
                console.log(totalIncome);
                const totalExpense = parseFloat(totalSpending);
                const remainingBalance = totalIncome - totalExpense;

                setChartData({
                    labels: ['Total Income', 'Total Expense'],
                    datasets: [
                        {
                            label: 'Amount',
                            data: [totalIncome, totalExpense],
                            backgroundColor: [
                                'rgb(62,156,53)',
                                'rgb(246,14,4)',

                            ],
                            borderWidth: 1,
                        },
                    ],
                });

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentUser, balances]);

    if (isLoading || !currentUser || !balances || !chartData) {
        return <div><h1>Income vs spending </h1> Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const checkingBalance = balances.filter(account => account.name.includes("CHECKING"));

    return (
        <div>
            <h1>Income vs spending </h1>
            <p>Checking Balance: {checkingBalance[0]?.balance}</p>
            <div>

                <div><Pie data={chartData} /></div>
            </div>
            <p>money Remaining: ${totalDeposits - totalSpending}</p>
        </div>
    );
};
