const loading = {
    hide: () => {
        $('#loading').hide();
    },
    show: () => {
        $('#loading').show();
    }
};

const view = {
    load: async (fileName, callback) => {
        loading.show();
        await fetch(fileName)
            .then((response) => {
                return response.text();
            }).then((html) => {
                $("#wrapper").html(html);
                callback();
                view.events();
                loading.hide();
            }).catch((error) => {
                console.warn('Error loading view: ', error);
            });
    },
    events: () => {
        $('.modal').modal({
            keyboard: false,
            backdrop: 'static'
        });
    }
};

const formatter = {
    date: (date) => {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        month = (month < 10 ? "0" : "") + month;
        day = (day < 10 ? "0" : "") + day;
        hour = (hour < 10 ? "0" : "") + hour;
        min = (min < 10 ? "0" : "") + min;
        sec = (sec < 10 ? "0" : "") + sec;

        return day + "/" + month + "/" + date.getFullYear() + " " + hour + ":" + min + ":" + sec;
    },
    money: (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign +
                (j ? i.substr(0, j) + thousands : '') +
                i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
                (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
        }
    }
};