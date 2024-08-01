export const equals = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;

    if (a.length !== b.length) return false;

    return JSON.stringify(a) === JSON.stringify(b);
};

export const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

export const convertToK = (num) => {
    if (num >= 1000 * 1000) {
        return `${(num / (1000 * 1000)).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num;
}


export const getColor = (colorId) => {
    const colors = {
        "LOGIN": "#4caf50",
        "LOGOUT": "#f44336",
        "REGISTER": "#2196f3",
        "CREATE": "#B39CD0",
        "UPDATE": "#ff9800",
        "DELETE": "#9c27b0",
        "ASSIGN_ROLE": "#00bcd4",
        "FAVORITE": "#845EC2",
        "UNFAVORITE": "#ffb74d",
        "COMMENT": "#00C9A7",
    }

    return colors[colorId];
}

export const convert2DArray = (arr) => {
    const newArr = [];
    const temp = [];

    for (let i = 0; i < arr.length; i++) {
        if (temp.length < 1) {
            temp.push(arr[i]);
        } else {
            if (temp[temp.length - 1].seatCode[0] !== arr[i].seatCode[0]) {
                newArr.push(temp);
                temp.length = 0;
                temp.push(arr[i]);
            } else {
                temp.push(arr[i]);
            }
        }
    }
    
    if (temp.length > 0) {
        newArr.push(temp);
    }

    return newArr;

}