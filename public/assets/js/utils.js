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
    events:()=>{
        $('.modal').modal({
            keyboard: false,
            backdrop: 'static'
        });
    }
};