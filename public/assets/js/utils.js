function loading(value) {
    if (value) {
        $('#loading').show();
    } else {
        $('#loading').hide();
    }
}


$('.modal').modal({
    keyboard: false,
    backdrop: 'static'
});

export { loading }