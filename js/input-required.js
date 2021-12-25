$(document).ready(function() {
    new InputRequired()
})

class InputRequired {
    constructor() {
        this.initEvents()
    }

    initEvents() {

        //Func: Remove class invalid khi nhập nếu có
        //write by Le Manh Hung
        $(".m-popup-grid-input").on("keyup", '.m-input-required', function() {

            if ($(this).val().trim() != '') {
                $(this).removeClass("invalid");
                $(this).siblings('.m-input-msg').hide();
            }
        })

        //Func: check value input
        //write by Le Manh Hung
        $(".m-popup-grid-input").on("blur", '.m-input-required', function() {
            if ($(this).val().trim() == '') {

                $(this).addClass("invalid");
                // $(this).siblings('.m-input-msg').show();
            }
            if ($(this).val().trim() != '') {
                $(this).removeClass("invalid");
                $(this).siblings('.m-input-msg').hide();
            }
        })

    }
}