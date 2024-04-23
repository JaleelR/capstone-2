export const TransactionsCard = ({ name, amount, date }) => {
    return (
        <tr className="border-b">
            <td className="border px-4 py-2">{name}</td>
            <td className="border px-4 py-2">${parseFloat(amount).toFixed(2)}</td>
            <td className="border px-4 py-2">{date}</td>
        </tr>
    );
};
