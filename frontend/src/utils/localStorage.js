export function saveApplicationData(data) {
    localStorage.setItem('sql_cinema', JSON.stringify(data));
}

export function loadApplicationData() {
    const appData = localStorage.getItem('sql_cinema');
    return appData ? JSON.parse(appData) : {};
}

export function clearApplicationData() {
    localStorage.removeItem('sql_cinema');
}

export function loadAuthToken() {
    return loadApplicationData().auth_token;
}

export function loadUser() {
    return loadApplicationData().user;
}

export function addItem(item, value) {
    const data = loadApplicationData();
    data[item] = value;
    saveApplicationData(data);
}