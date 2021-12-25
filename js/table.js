$(document).ready(function() {
    new TableContent();
});

class TableContent {
    constructor() {
        this.initEvent();
    }
    initEvent() {
        $('table#tblEmployee').on('click', '.ms-checkbox-all', CheckboxStatusAll.bind(this));
        // khi click vào nút checkbox trong 1 dòng dữ liệu bất kì => chuyển đổi trạng thái
        $('table#tblEmployee').on('click', '.ms-checkbox-item', CheckboxItem.bind(this));
        // click vào dropdown trong phần chức năng
        $('table#tblEmployee').on('click', ' .m-icon-dropdown', rowClickIconDropDown);
    }

    // Phần load data

}

function CheckboxStatusAll(sender) {
    // $('.ms-checkbox .m-checkbox-active').show();
    // Hiển thị checkbox all
    let trCheckbox = $('table#tblEmployee tbody tr');
    // Kiêm tra checkbox all false => đổi item checkbox true
    let rowcurrent = sender.currentTarget;
    // Chuyển trạng thái item checkbox từ false -> true
    if ($(rowcurrent).parents('tr').hasClass('ms-checkbox-false')) {
        for (const tr of trCheckbox) {
            if ($(tr).hasClass('ms-checkbox-false')) {
                // Chuyển đối trạng thái của tr hiện tại sang true
                $(tr).toggleClass('ms-checkbox-false ms-checkbox-true');
                $(tr).find('.m-checkbox-active').show();
                // Hiển thị m-delete-all
                $('#btnAllDelete').show();
            }
        }
    } else {
        for (const tr of trCheckbox) {
            if ($(tr).hasClass('ms-checkbox-true')) {
                // Chuyển đối trạng thái của tr hiện tại sang true
                $(tr).toggleClass('ms-checkbox-false ms-checkbox-true');
                $(tr).find('.m-checkbox-active').hide();
                $('#btnAllDelete').hide();
            }
        }
    }
    // Chuyển trạng thái dấu checkbox
    $(rowcurrent).find('.m-checkbox-active').toggle();
    $(rowcurrent).parents('tr').toggleClass('ms-checkbox-false ms-checkbox-true');

}

function CheckboxItem(sender) {
    // Kiểm tra checkbox hiện tại đang false hay true
    let rowcurrent = sender.currentTarget;
    // Chuyển đổi trạng thái
    // Kiểm tra nếu item checkbox hiện tại đang true => false 
    if ($(rowcurrent).parents('tr').hasClass('ms-checkbox-true')) {
        // Chuyển đổi dòng hiện tại sang false
        $(rowcurrent).parents('tr').toggleClass('ms-checkbox-true ms-checkbox-false');
        // Kiểm tra nút checkboxall nếu đang true
        if ($('table#tblEmployee thead').find('tr').hasClass('ms-checkbox-true')) {
            // Checkboxall chuyển trạng thái sang false
            $('table#tblEmployee thead').find('tr').toggleClass('ms-checkbox-true ms-checkbox-false');
            // Ẩn nút checkboxall
            $('table#tblEmployee thead').find('.m-checkbox-active').hide();

        }
        $(rowcurrent).find('.m-checkbox-active').toggle();
    } else {
        $(rowcurrent).parents('tr').toggleClass('ms-checkbox-true ms-checkbox-false');
        $(rowcurrent).find('.m-checkbox-active').toggle();

    }
    // Kiểm tra còn nút nào đang m-check-box-active
    let num = $('table#tblEmployee tbody').children().filter('.ms-checkbox-true').length;
    if (num > 0) {
        $('#btnAllDelete').show();
    } else {
        $('#btnAllDelete').hide();
    }
}

function rowClickIconDropDown() {

    if (!$(this).parent().hasClass('add-border-dropdown')) {
        // thêm class để style css vào nút dropdown
        $(this).parent().addClass('add-border-dropdown');
    } else {
        $(this).parent().removeClass('add-border-dropdown');
    }
    // Hiển thị các tính năng
    $(this).parents('.m-features').find('.m-features-grid').toggle();
}

function selectFeatures123() {
    // // Lấy ra features-text ban đầu khi chưa click vào features khác
    // let featuresIntial = $(this).parents('.m-features').children('.m-features-text');
    // let textIntial = $(featuresIntial).text();
    // let valueIntial = $(featuresIntial).attr('value');
    // // Lấy ra text và value của tính năng
    // let text = $(this).text();
    // let value = $(this).attr('value');
    // // Phần one-features sẽ thay thế tính năng ban đầu
    // $(this).parents('.m-features').children('.m-features-text').html(text);
    // $(this).parents('.m-features').children('.m-features-text').attr({ 'value': value });
    // // Ẩn các tất cả tính năng và xóa hiệu ứng dropdown
    // $(this).parent().hide();
    // // Thay thế item đã chọn bằng item khởi tạo ban đầu
    // $(this).attr({ 'value': valueIntial });
    // $(this).html(textIntial);
    // $(this).parents('.m-features').find('.add-border-dropdown').removeClass('add-border-dropdown');
}