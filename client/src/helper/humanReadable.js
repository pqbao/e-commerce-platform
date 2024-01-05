const months = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
];
const days = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
];

export const humanReadableDate = (date) => {
    date = new Date(date);
    return (
        days[date.getDay()] +
        ' ' +
        date.getHours() +
        'h' +
        date.getMinutes() +
        " - Ngày " +
        date.getDate() +
        ' tháng ' +
        months[date.getMonth()] +
        ' năm ' +
        date.getFullYear()
        
    );
};

export const humanReadableDateSub = (date) => {
    date = new Date(date);
    return (
        date.getHours() +
        ':' +
        date.getMinutes() +
        " " +
        date.getDate() +
        '-' +
        months[date.getMonth()] +
        '-' +
        date.getFullYear()
        
    );
};

export const formatDate = (date) => {
    return (
        new Date(date).getFullYear() +
        '/' +
        new Date(date).getMonth() +
        '/' +
        new Date(date).getDate()
    );
};

export const formatMonth = (date) => {
    return new Date(date).getFullYear() + '/' + new Date(date).getMonth();
};

export const formatYear = (date) => {
    return new Date(date).getFullYear();
};

export const formatTime = (date) => {
    date = new Date(date);
    return (
        date.getFullYear() +
        ' ' +
        months[date.getMonth()] +
        ' ' +
        date.getDate() +
        ', ' +
        days[date.getDay()] +
        ' ' +
        date.getHours() +
        'h'
    );
};
