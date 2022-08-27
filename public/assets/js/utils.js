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
        await fetch(fileName)
            .then((response) => {
                return response.text();
            }).then((html) => {
                $("#wrapper").html(html);
                callback();
            }).catch((error) => {
                console.warn('Error loading view: ', error);
            });
    }
};

$(() => {
    $('.modal').modal({
        keyboard: false,
        backdrop: 'static'
    });
});