


export const FormattedDate = (date) => {
    const timeStampString = date;
    const timeStamp = new Date(timeStampString);

    const month = timeStamp.toLocaleString('default', { month: 'long' })
    const day = timeStamp.getDate();
    const year = timeStamp.getFullYear();
    const hours = timeStamp.getHours();
    const minutes = timeStamp.getMinutes();
    const formattedDate = `${month} ${day}, ${year}`;
    return formattedDate;
}