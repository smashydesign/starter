const arr = [1, 2, 3];
const iAmJavascriptES6 = () => console.log(...arr);
window.iAmJavascriptES6 = iAmJavascriptES6;
const getDate = () => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const date = new Date();
    return {
        time: date.toLocaleTimeString('en', options),
    };
};
(() => {
    document.getElementById('time').innerHTML = getDate().time;
    iAmJavascriptES6();
})();
