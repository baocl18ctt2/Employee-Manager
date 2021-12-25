$(document).ready(function() {
    new Employee();
});

class Employee extends basePage {
    formMode;
    employeeIDSelected;
    constructor() {
        super('tblEmployee', 'EmployeeId', 'http://amis.manhnv.net/api/v1/Employees');
        // this.loadData();
        this.loadDepartmentCombobox();
        this.loadPositionCombobox();
        this.initEvent();
    }


    initEvent() {
        // Sự kiện khi click vào nút add btn employee
        $('#btnAddEmployee').click(showTablePopUp.bind(this));

        // Sự kiện khi click vào nút hủy
        $('#btnDelete').click(function() {
            $("#showPopup").hide();
        });

        // Sự kiện khi click vào nút cất và thêm
        $('#btnSave').click(saveNewEmployee.bind(this));

        // Sự kiện khi click vào nút select giới tính
        $('#radioGender').on('click', '.ms-radio', clickOnRadio);
        // Sự kiện khi click vào nút title popup (là khách hàng hay nhà cung cấp)
        $('.m-popup-header').on('click', '.ms-checkbox', clickOnCheckBoxTitle);

        // Thuộc tính khi click vào 1 chức năng
        $("#tblEmployee").on('click', '.m-features .m-features-text', rowDbOnEditEmployee.bind(this));
        // Lựa chọn tính năng khi xuất hiện m-features-grid
        $('table#tblEmployee').on('click', '.m-features-grid .m-one-features', selectFeatures.bind(this));

        // Ẩn hiện phần chọn số trang trong paging table
        $('.m-combobox-wrapper').on('click', '.m-btn-icon', showHideComboboxList);
        // Lựa chọn số trang và hiển thị số trang chọn
        $('.m-combobox-wrapper').on('click', '.m-combobox-item', numberEmployeePerPage.bind(this));
        // Sự kiện khi tìm kiếm trên trang
        $('#txtSearch').on('blur', SearchInformationEmployee.bind(this));
        // Sự kiện khi clip vào nút "sau" trong phần pagging
        $('.m-content-footer-page').on('click', '.m-number-text-after', loadDataNextPage.bind(this));
        // Sự kiện khi clip vào nút "trước" trong phần pagging
        $('.m-content-footer-page').on('click', '.m-number-text-before', loadDataPrevPage.bind(this));
        // Sự kiện Khi clip vào trang bất kì
        $('.m-content-footer-page').on('click', '.m-number', showTableCurrentPage.bind(this));

        // Sự kiện clip vào nút đồng ý xóa nhân viên
        $('.m-modal').on('click', '.m-button-modal button', deleteEmployee.bind(this));
        // Sự kiện clip xóa nút delete warning
        $('.m-modal').on('click', '.m-icon-close', notDeleteEmployee);

        // Xóa nhiều đối tượng
        $('#btnAllDelete').on('click', 'button', deleteAllEmployee.bind(this));

        // Sự kiện clip vào nút refresh
        $('#btnRefresh').click(reloadData.bind(this));

    }

    loadDepartmentCombobox() {
        // Lấy dữ liệu api 
        let departments = this.ajaxDepartment('');
        for (const department of departments) {
            let itemsDepartmentHTML =
                $(`<div class="m-combobox-item" value=${department.DepartmentId}>${department.DepartmentName}</div>`);
            $('#cbxDepartment .m-combobox-data').append(itemsDepartmentHTML);
        }

    };

    loadPositionCombobox() {
        // Lấy dữ liệu api
        let positions = this.ajaxPosition('');
        if (positions == 0) {
            return;
        } else {
            for (const position of positions) {
                let itemsDepartmentHTML =
                    $(`<div class="m-combobox-item" value=${position.PositionId}>${position.PositionName}</div>`);
                $('#cbxPosition .m-combobox-data').append(itemsDepartmentHTML);
            }
        }
    };

    ConfirmDeleteEmployee(employeeID) {

        // Gọi lên ajax tìm nhân viên => lấy ra mã nhân viên
        let data = null;
        $.ajax({
            type: "GET",
            url: `http://amis.manhnv.net/api/v1/Employees/${this.employeeIDSelected}`,
            async: false,
            success: function(response) {
                // Xuất hiện hộp thoại
                data = response;
            }
        });

        // Xóa hết nội dung trong modal-content
        $('.m-background-modal .m-modal-text').remove();
        let employeecodeHTML = $(`<p id="inforWarning"></p>`);
        let employeeCode = data.EmployeeCode;
        // Append dữ liệu thẻ p
        employeecodeHTML.text(employeeCode);
        let textHTML = $(`<div class="m-modal-text">Bạn có thực sự muốn xóa Nhân viên
                                < ${employeecodeHTML.text()} > không?
                           </div>`);
        $('.m-background-modal .m-modal-content').append(textHTML);
        // Xuất hiện hộp thoại thông báo
        $('.m-background-modal').show();
    }


    /**
     * Xử lí chỉnh sửa thông tin employee
     */
    rowDbOnEditEmployee(sender) {
        this.formMode = Enum.formMode.Update;
        var that = this;
        var currentRow = sender.currentTarget;
        // Hiển thị màu đối tượng table đang click 
        $(currentRow).siblings().removeClass('row-selected');
        $(currentRow).addClass('row-selected');
        // Lấy thông tin id của nhân viên
        this.employeeIDSelected = $(currentRow).parents('tr').data('EmployeeId');
        // Lấy thông tin chi tiết của nhân viên 
        $.ajax({
            type: "GET",
            url: `http://amis.manhnv.net/api/v1/Employees/${this.employeeIDSelected}`,
            async: false,
            success: function(employee) {

                // Hiển thị thông tin form
                $("#showPopup").show();
                // Lấy toàn bộ các input sẽ binding dữ liệu -> có attribute[filedName]
                let inputs = $('.m-popup input[fieldName]');
                for (const input of inputs) {
                    // Lấy ra tên của trường field name

                    let nameFileName = $(input).attr('fieldName');
                    let value = employee[nameFileName];
                    if (nameFileName == 'Department') {
                        let departmentId = employee['DepartmentId'];

                        // Gọi lên ajax DepartmentID ==> lấy ra departmentName
                        let dataDepartment = that.ajaxDepartment(departmentId);
                        value = dataDepartment.DepartmentName;
                    }
                    // binding dữ liệu lên popup
                    $(input).val(value);

                }
                // Hiển thị thông tin form
                $("#showPopup").show();
            }
        });
    }

}

/**
 * Xử lí chỉnh sửa thông tin employee
 */
function rowDbOnEditEmployee(sender) {
    this.formMode = Enum.formMode.Update;
    var that = this;
    var currentRow = sender.currentTarget;
    // Hiển thị màu đối tượng table đang click 
    $(currentRow).siblings().removeClass('row-selected');
    $(currentRow).addClass('row-selected');
    // Lấy thông tin id của nhân viên
    this.employeeIDSelected = $(currentRow).parents('tr').data('EmployeeId');
    // Lấy thông tin chi tiết của nhân viên
    $.ajax({
        type: "GET",
        url: `http://amis.manhnv.net/api/v1/Employees/${this.employeeIDSelected}`,
        async: false,
        success: function(employee) {
            // Hiển thị thông tin form
            $("#showPopup").show();
            // Xóa phần select gender
            // Kiểm tra nút hiện đang có có nút nào check-true hay không?
            let radios = $('.m-select-gender .ms-radio');
            for (const radio of radios) {
                // Kiểm tra nút radio nào checktrue => xóa checktrue
                if ($(radio).children().hasClass('ms-radio-border-checked-true')) {
                    $(radio).children().removeClass('ms-radio-border-checked-true');
                }
            }
            // Lấy toàn bộ các input sẽ binding dữ liệu -> có attribute[filedName]
            let inputs = $('.m-popup input[fieldName]');
            for (const input of inputs) {
                // Lấy ra tên của trường field name
                let nameFileName = $(input).attr('fieldName');
                let value = employee[nameFileName];
                if (nameFileName == 'Department') {
                    let departmentId = employee['DepartmentId'];
                    // Gọi lên ajax DepartmentID ==> lấy ra departmentName
                    let dataDepartment = that.ajaxDepartment(departmentId);
                    value = dataDepartment.DepartmentName;
                }
                // binding dữ liệu lên popup
                $(input).val(value);
            }
            // Lấy dữ liệu của gender và binding lên popup
            radios = $('#radioGender .m-select-gender');
            for (const radio of radios) {
                // Lấy ra giá trị của value của từng gender
                let value = $(radio).children('.m-gender').attr('value');
                // Kiếm tra nếu employee.gender == value thì hiển thị lên popup
                if (employee.Gender == value) {
                    // Hiển thị lên phần m-popup-grid-input
                    $('#radioGender').children('.m-select-gender-grid').attr({ 'value': employee.Gender });
                    $('#radioGender').children('.m-select-gender-grid').data({ 'value': employee.Gender });
                    $('#radioGender').children('.m-select-gender-grid').attr({ 'GenderName': employee.GenderName });
                    $('#radioGender').children('.m-select-gender-grid').data({ 'GenderName': employee.GenderName });
                    // Thêm class cho nút radio và hiển thị kết quả
                    $(radio).children('.ms-radio').children().addClass('ms-radio-border-checked-true');
                    $(radio).children('.ms-radio').children().show();
                    break;
                }
            }

            // Hiển thị thông tin form
            $("#showPopup").show();
        }
    });
}

function showTablePopUp() {
    this.formMode = Enum.formMode.Add;
    // Hiển thị pop up
    $('#showPopup').show();
    // Tự động xóa hết dữ liệu trong thẻ input
    $('#showPopup input').val(null);
    // Xóa value đã lưu trữ trong các mcombobox
    $('#showPopup *').find('.mcombobox').removeData('value');
    // Gọi lên ajax => lấy mã nhân viên tự động
    var data = this.ajaxAPI('NewEmployeeCode');
    $('#txtEmployeeCode').focus();
    $('#txtEmployeeCode').val(data);
}


/**
 * Xử lí thêm thông tin employee và lưu lại dữ liệu
 */
function saveNewEmployee() {

    // Làm rỗng nội dung thông báo
    $('.m1-toast-msg .m1-toast-msg-infor').empty();
    // Build thành 1 object nhân viên
    var employee = {};
    // Thu thập dữ liệu khi người ta điền thông tin
    let inputs = $('.m-popup input[fieldName]');
    for (const input of inputs) {
        let nameFileName = $(input).attr('fieldName');
        employee[nameFileName] = $(input).val();
        if (nameFileName == 'Department') {
            employee['DepartmentId'] = $(input).parents('.mcombobox').data('value');
            employee['DepartmentName'] = $(input).val();
        }
        if (nameFileName == 'Position') {
            employee['PositionId'] = $(input).parents('.mcombobox').data('value');
            employee['PositionName'] = $(input).val();
        }
    }
    // lấy ra giá trị giới tính và tên giới tính
    let gender = $('#radioGender').children('.m-select-gender-grid').data('value');
    employee['Gender'] = gender;
    let GenderName = $('#radioGender').children('.m-select-gender-grid').data('GenderName');
    employee['GenderName'] = GenderName;
    var that = this;
    // Sử dụng ajax để gọi lên API lưu trữ dữ liệu
    if (this.formMode == Enum.formMode.Add) {
        // Thêm thông tin nhân viên vào bảng table
        $.ajax({
            type: "POST",
            url: "http://amis.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employee),
            dataType: "json",
            async: false,
            contentType: "application/json",
            success: function(response) {
                // Hiện toast-msg thông báo "thêm mới thành công"
                $('.m-toast-msg-add').show();
                setTimeout(() => {
                    $('.m-toast-msg-add').hide();
                }, 3000);
                // Ẩn popup form
                $("#showPopup").hide();
                // Hiển thị employee mới
                that.loadData();
            },
            error: function(response) {
                if (response.status == 400) {
                    // Thay đổi trạng thái không phải delete
                    this.formMode = null;
                    // Xóa hết nội dung trong modal-content
                    $('.m-background-modal .m-modal-text').remove();
                    let textHTML = $(`<div class="m-modal-text">${response.responseJSON.userMsg}
                                      </div>`);
                    $('.m-background-modal .m-modal-content').append(textHTML);
                    // Xuất hiện hộp thoại thông báo
                    $('.m-background-modal').show();
                }
                $('.m-toast-msg-background').show();
                // Chèn thông tin thông báo trạng thái khi thêm vào
                let textHTML = $(`<div class="m1-toast-msg-icon"><i class="fas fa-exclamation-circle"></i></div>
                <div class="m1-toast-text">Thêm mới không thành công. Vui lòng thử lại!</div>`);
                $('.m1-toast-msg .m1-toast-msg-infor').append(textHTML);
                setTimeout(() => {
                    $('.m-toast-msg-background').hide();
                }, 2000);
            }
        });
    } else {
        // Lưu thông tin nhân viên sau khi đã chỉnh sửa
        $.ajax({
            type: "PUT",
            url: `http://amis.manhnv.net/api/v1/Employees/${this.employeeIDSelected}`,
            data: JSON.stringify(employee),
            dataType: "json",
            async: false,
            contentType: "application/json",
            success: function(response) {
                // Hiện toast-msg thông báo "chỉnh sửa thành công"
                $('.m-toast-msg-edit').show();
                setTimeout(() => {
                    $('.m-toast-msg-edit').hide();
                }, 3000);
                // Ẩn popup form
                $("#showPopup").hide();
                // Hiển thị employee mới
                that.loadData();
            },
            error: function(response) {
                // Trạng thái lỗi là gì
                if (response.status == 500) {
                    // Thay đổi trạng thái không phải delete
                    this.formMode = null;
                    // Xóa hết nội dung trong modal-content
                    $('.m-background-modal .m-modal-text').remove();
                    let textHTML = $(`<div class="m-modal-text">${response.responseJSON.userMsg}
                                      </div>`);
                    $('.m-background-modal .m-modal-content').append(textHTML);
                    // Xuất hiện hộp thoại thông báo
                    $('.m-background-modal').show();
                }
                $('.m-toast-msg-background').show();
                let textHTML = $(`<div class="m1-toast-msg-icon"><i class="fas fa-exclamation-circle"></i></div>
                <div class="m1-toast-text">Chỉnh sửa thông tin không thành công. Vui lòng thử lại!</div>`);
                $('.m1-toast-msg .m1-toast-msg-infor').append(textHTML);
                setTimeout(() => {
                    $('.m-toast-msg-background').hide();
                }, 2000);
            }
        });
    }

}

function clickOnRadio() {
    // Hiển
    // Kiểm tra nút hiện đang có có nút nào check-true hay không?
    let radios = $('.m-select-gender .ms-radio');
    for (const radio of radios) {
        // Kiểm tra nút radio nào checktrue => xóa checktrue
        if ($(radio).children().hasClass('ms-radio-border-checked-true')) {
            $(radio).children().removeClass('ms-radio-border-checked-true');
        }
    }
    // Hiển thị class check-true của nút đamg trỏ tới
    $(this).children('.ms-radio-border').addClass('ms-radio-border-checked-true');
    // hiển thị dấu check-true khi click vào
    $(this).children().show();
    // Lấy ra text và value tương ứng
    let GenderName = $(this).parent().children()[1].textContent;
    let value = $(this).parent().children('.m-gender').attr('value');
    // thêm class cho m-select-gender-grid
    $(this).parents('.m-select-gender-grid').attr({ 'GenderName': GenderName });
    $(this).parents('.m-select-gender-grid').data({ 'GenderName': GenderName });
    $(this).parents('.m-select-gender-grid').attr({ 'value': value });
    $(this).parents('.m-select-gender-grid').data({ 'value': value });
}


function clickOnCheckBoxTitle() {
    // Kiểm tra nếu người dùng clip vào nút hiện tại đang active => xóa nút hiện tại
    if ($(this).parent().hasClass('ms-active')) {
        $(this).parent().removeClass('ms-active');
        $(this).children('.m-checkbox-active').hide();
        return;
    } else {
        // Kiểm tra xem có checkbox nào đang active thì xóa
        $('.m-popup-header').find('.ms-active').find('.m-checkbox-active').hide();
        $('.m-popup-header').find('.ms-active').removeClass('ms-active');
        // Thêm 1 class vào grid-checkbox đó đã có class activte
        $(this).parent().addClass('ms-active');
        $(this).children('.m-checkbox-active').show();
    }
}
/**
 * Xử lí xóa thông tin nhân viên
 */
function clickRowOnTable(sender) {
    let currentRow = sender.currentTarget;
    // số lượng phần tử con trong tr hiện tại
    let children = $(currentRow).children();
    let tdNum = $(children).length;
    let a = $(children)[0];
    if ($(a).hasClass('checkSelected')) {
        return;
    }
    // Hiển thị màu đối tượng table đang click 
    $(currentRow).siblings().removeClass('m-color-table-tr');
    $(currentRow).addClass('m-color-table-tr');
    //  lấy id của đối tượng
    this.employeeIDSelected = $(currentRow).data('EmployeeId');
}

// function EventOnClickFeatures(sender) {

//     let currentRow = sender.currentTarget;
//     let value = $(currentRow).attr('value');
//     value = parseInt(value);
//     // Lấy mã nhân viên tương ứng
//     this.employeeIDSelected = $(currentRow).parents('tr').data('EmployeeId');
//     switch (value) {
//         case 1:
//             //Gọi lên ajax Employee => delete method
//             this.deleteOneEmployee(this.employeeIDSelected);
//             this.loadData();
//             break;
//         case 4:
//             $(currentRow).click(rowDbOnEditEmployee.bind(this));
//             break;
//         default:
//             break;
//     }
// }

function showHideComboboxList() {
    // Hiện combobx-pagging-list
    $(this).parent().siblings('.m-combobox-pagging-list').toggle();

    let currentPagging = $(this).parent().siblings('.m-combobox-pagging-list').children('.m-combobox-item-active');
    $(currentPagging).addClass('m-combobox-item-active');
}

function numberEmployeePerPage(sender) {
    let currentRow = sender.currentTarget;
    // lấy ra value và text tương ứng

    let text = $(currentRow).text();
    let value = $(currentRow).attr('value');
    // Hiển thị lên m-combobx-text
    $(currentRow).parents('.m-combobox-wrapper').children('.m-combobox-text').html(text);
    $(currentRow).parents('.m-combobox-wrapper').children('.m-combobox-text').attr({ 'value': value });
    // removeClass items trước đó
    $(currentRow).siblings('.m-combobox-item-active').removeClass('m-combobox-item-active');
    // addClass items cho đối tượng đó
    $(currentRow).addClass('m-combobox-item-active');
    // Ẩn combobox-paging-list
    $(currentRow).parent().hide();
    // Load Data
    this.currentPageIndex = 1;
    this.loadData();
}

function loadDataNextPage() {
    // Kiểm tra nút hiện tại đang có phải đang ở cuối trang hay không
    this.currentPageIndex = parseInt(this.currentPageIndex);
    // Kiểm tra trang phía sau có tồn tại trong pagging-number không
    let numbers = $('.m-pagging-number').children();
    for (let i = 0; i < $(numbers).length; i++) {
        let value = $(numbers[i]).attr('value');
        value = parseInt(value);
        if (value == this.currentPageIndex) {
            // Thay thế phần tử hiện tại
            if (!$(numbers[i + 1]).hasClass('m-number-bacham')) {
                $(numbers[i - 1]).children().text(this.currentPageIndex - 1);
                $(numbers[i - 1]).attr({ 'value': this.currentPageIndex - 1 });
                // Kiểm tra đối tượng đang trỏ tới
                // Phần tử thứ 2
                $(numbers[i]).children().text(this.currentPageIndex);
                $(numbers[i]).attr({ 'value': this.currentPageIndex });
                // Phần tử thứ 3
                $(numbers[i + 1]).children().text(this.currentPageIndex + 1);
                $(numbers[i + 1]).attr({ 'value': this.currentPageIndex + 1 });
                let text = $('.m-pagging-number').html();
                text = $('.m-pagging-number').attr({ 'textPaggingNumber': text });
                break;
            } else {
                $(numbers[i]).children().text(this.currentPageIndex + 1);
                $(numbers[i]).attr({ 'value': this.currentPageIndex + 1 });
                // Kiểm tra đối tượng đang trỏ tới
                // Phần tử thứ 2
                $(numbers[i - 1]).children().text(this.currentPageIndex);
                $(numbers[i - 1]).attr({ 'value': this.currentPageIndex });
                // Phần tử thứ 3
                $(numbers[i - 2]).children().text(this.currentPageIndex - 1);
                $(numbers[i - 2]).attr({ 'value': this.currentPageIndex - 1 });
                let text = $('.m-pagging-number').html();
                text = $('.m-pagging-number').attr({ 'textPaggingNumber': text });
                break;
            }
        }
    }
    // Tăng trang kết tiếp lên
    this.currentPageIndex += 1;
    this.loadData(this.currentPageIndex);
}

function loadDataPrevPage() {

    // Kiểm tra nút hiện tại đang có phải đang ở cuối trang hay không
    this.currentPageIndex = parseInt(this.currentPageIndex);
    // Kiểm tra trang phía sau có tồn tại trong pagging-number không
    let numbers = $('.m-pagging-number').children();
    let countBaCham = $(numbers).filter('.m-number-bacham').length;
    for (let i = 0; i < $(numbers).length; i++) {
        let value = $(numbers[i]).attr('value');
        value = parseInt(value);
        if (value == this.currentPageIndex) {
            // Thay thế phần tử hiện tại

            if (!$(numbers[i - 1]).hasClass('m-number-bacham')) {
                $(numbers[i - 1]).children().text(this.currentPageIndex - 1);
                $(numbers[i - 1]).attr({ 'value': this.currentPageIndex - 1 });
                // Kiểm tra đối tượng đang trỏ tới
                // Phần tử thứ 2
                $(numbers[i]).children().text(this.currentPageIndex);
                $(numbers[i]).attr({ 'value': this.currentPageIndex });
                // Phần tử thứ 3
                $(numbers[i + 1]).children().text(this.currentPageIndex + 1);
                $(numbers[i + 1]).attr({ 'value': this.currentPageIndex + 1 });
                let text = $('.m-pagging-number').html();
                text = $('.m-pagging-number').attr({ 'textPaggingNumber': text });
                break;
            } else {
                $(numbers[i]).children().text(this.currentPageIndex - 1);
                $(numbers[i]).attr({ 'value': this.currentPageIndex - 1 });
                // Kiểm tra đối tượng đang trỏ tới
                // Phần tử thứ 2
                $(numbers[i + 1]).children().text(this.currentPageIndex);
                $(numbers[i + 1]).attr({ 'value': this.currentPageIndex });
                // Phần tử thứ 3
                $(numbers[i + 2]).children().text(this.currentPageIndex + 1);
                $(numbers[i + 2]).attr({ 'value': this.currentPageIndex + 1 });
                let text = $('.m-pagging-number').html();
                text = $('.m-pagging-number').attr({ 'textPaggingNumber': text });
                break;
            }
        }
    }

    // Giảm trang kết tiếp
    this.currentPageIndex -= 1;
    this.loadData(this.currentPageIndex);
}


function showTableCurrentPage(sender) {
    let currentRow = sender.currentTarget;
    // Xóa hết m-bacham-active
    $('.m-pagging-number').find('.m-bacham-active').removeClass('m-bacham-active');
    // Lấy ra giá trị của trang đang trỏ tới
    let value = $(currentRow).parent().attr('value');
    if (value) {
        value = parseInt(value);
        this.currentPageIndex = value;
        // Lưu lại nội dung phần pagging number
        let text = $('.m-pagging-number').html();
        text = $('.m-pagging-number').attr({ 'textPaggingNumber': text });
        this.loadData(this.currentPageIndex);
    } else {

        // Thêm class nào đang click vào dấu ba chấm
        $(currentRow).addClass('m-bacham-active');
        let numbers = $(currentRow).parent().children();
        let countBaCham = $(numbers).filter('.m-number-bacham').length;
        let lenNumbers = numbers.length;
        for (let i = 0; i < lenNumbers; i++) {
            if ($(numbers[i]).hasClass('m-bacham-active')) {
                // Hiển thị trang trước dấu 3 chấm
                let valueBefore = $(numbers[i - 1]).attr('value');
                let valueAfter = $(numbers[i + 1]).attr('value');
                valueBefore = parseInt(valueBefore);
                valueAfter = parseInt(valueAfter);
                let t = valueBefore + 3;
                // Nếu 3 trang tiếp theo mà phần tử cuối nhỏ hơn totalPage thì in ra hết
                if (valueBefore != 1) {
                    // Nếu 3 trang tiếp theo trong dấu 3 chấm nhỏ hơn totalPage
                    if (t < this.totalPage) {
                        let arrayButtonHTML = [];
                        for (let indexPage = valueBefore + 1; indexPage <= t; indexPage++) {

                            let buttonHTML = $(`<div>
                                                <div class="m-number">${indexPage}</div>               
                                            </div>`);
                            buttonHTML.attr('value', indexPage);
                            arrayButtonHTML.push(buttonHTML);
                        }
                        arrayButtonHTML.join('');
                        $(numbers[i - 1]).after(arrayButtonHTML);

                        if (countBaCham == 1) {
                            // Xóa 2 phần tử ở trước đó
                            $(numbers[i - 1]).remove();
                            $(numbers[i - 2]).empty();
                            // Thêm class ba chấm
                            let daubacham = $(`<div class="m-number m-number-bacham">...</div>`);

                            $(numbers[i - 2]).after(daubacham);
                            $(numbers[i - 2]).remove();
                            break;
                        }
                        if (countBaCham == 2) {
                            $(numbers[i - 1]).remove();
                            $(numbers[i - 2]).remove();
                            $(numbers[i - 3]).remove();
                        }
                    }
                    if (t >= this.totalPage) {

                        let arrayButtonHTML = [];
                        if (t == this.totalPage) {

                            for (let indexPage = valueBefore + 1; indexPage <= valueAfter - 1; indexPage++) {
                                let buttonHTML = $(`<div>
                                                <div class="m-number">${indexPage}</div>               
                                            </div>`);
                                buttonHTML.attr('value', indexPage);
                                arrayButtonHTML.push(buttonHTML);
                            }

                        } else {

                            for (let indexPage = valueBefore; indexPage <= valueAfter - 1; indexPage++) {
                                let buttonHTML = $(`<div>
                                                <div class="m-number">${indexPage}</div>               
                                            </div>`);
                                buttonHTML.attr('value', indexPage);
                                arrayButtonHTML.push(buttonHTML);
                            }
                        }

                        arrayButtonHTML.join('');
                        $(numbers[i - 1]).after(arrayButtonHTML);

                        // Xóa dấu 3 chấm ở phía sau
                        $(currentRow).remove();
                        // Xoá 2 phần tử trước đó
                        if (countBaCham == 1) {
                            $(numbers[i - 1]).remove();
                            $(numbers[i - 2]).empty();
                            // Thêm class ba chấm
                            let daubacham = $(`<div class="m-number m-number-bacham">...</div>`);

                            $(numbers[i - 2]).after(daubacham);
                            $(numbers[i - 2]).remove();
                            break;
                        }
                        if (countBaCham == 2) {
                            if (t - this.totalPage == 2) {
                                $(numbers[i - 1]).remove();
                                $(numbers[i - 3]).remove();
                                break;
                            } else {

                                $(numbers[i - 1]).remove();
                                $(numbers[i - 2]).remove();
                                $(numbers[i - 3]).remove();
                                break;
                            }
                        }

                    }
                }
                // Nếu value before bằng 1
                else {
                    if (valueAfter - 3 <= valueBefore) {
                        this.loadData();
                    } else {

                        for (let index = 1; index <= 3; index++) {
                            // Lấy ra giá trị của đối tượng phía sau dấu ba chấm
                            let value = $(numbers[i + index]).attr('value');
                            value = parseInt(value);
                            let valueNew = value - 3;
                            // Thay thế giá trị hiện đang có
                            $(numbers[i + index]).children().text(valueNew);
                            // Gắn lại value tương ứng
                            $(numbers[i + index]).attr({ 'value': valueNew });
                        }
                        if (countBaCham == 1) {
                            // Thêm dấu 3 chấm ở phía sau
                            let afterNumberHTML = []
                            let daubacham = $(`<div class="m-number m-number-bacham">...</div>`);
                            $(numbers[i + 3]).after(daubacham);
                            afterNumberHTML.push(daubacham);
                            let buttonHTML = $(`<div>
                                                    <div class="m-number">${this.totalPage}</div>               
                                                </div>`);
                            buttonHTML.attr('value', this.totalPage);
                            afterNumberHTML.push(buttonHTML);
                            afterNumberHTML.join('');
                            $(numbers[i + 3]).after(afterNumberHTML);
                        }
                        break;
                    }
                }
            }
        }
    }

    // Lưu lại nội dung phần pagging number
    let text = $('.m-pagging-number').html();
    text = $('.m-pagging-number').attr({ 'textPaggingNumber': text });
}

function SearchInformationEmployee() {
    this.currentPageIndex = 1;
    // Lấy ra giá trị của text hiện tại
    let text = $('#txtSearch').val();
    $('#txtSearch').attr({ 'value': text });
    this.loadData();
}

function selectFeatures(sender) {
    let currentRow = sender.currentTarget;

    this.employeeIDSelected = $(currentRow).parents('tr').data('EmployeeId');
    let value = $(currentRow).attr('value');
    value = parseInt(value);
    switch (value) {
        case 1:
            this.formMode = Enum.formMode.Delete;
            this.ConfirmDeleteEmployee(this.employeeIDSelected);
            this.loadData();
            break;

        default:
            break;
    }

}

function deleteEmployee() {
    var that = this;
    if (that.formMode == Enum.formMode.Delete) {
        // Gọi lên ajax phương thức push
        $.ajax({
            type: "DELETE",
            url: `http://amis.manhnv.net/api/v1/Employees/${this.employeeIDSelected}`,
            async: false,
            success: function(response) {
                // Hiện toast-msg thông báo "xóa thành công"
                $('.m-toast-msg-delete').show();
                setTimeout(() => {
                    $('.m-toast-msg-delete').hide();
                }, 3000);
                // Ẩn modal
                $('.m-background-modal').hide();
                // Load lại data
                that.loadData();
                // Load lại dữ liệu
                that.currentPageIndex = 1;
                that.loadData();
            }
        });
    } else {
        // Ẩn modal
        $('.m-background-modal').hide();
    }
}

function notDeleteEmployee() {
    // Ẩn modal
    $('.m-background-modal').hide();
}

function deleteAllEmployee(sender) {
    var that = this;
    let currentRow = sender.currentTarget;
    let trs = $('table#tblEmployee tbody').children().filter('.ms-checkbox-true');
    for (const tr of trs) {
        this.employeeIDSelected = $(tr).data('EmployeeId');
        // Gọi lên ajax để xóa
        // Gọi lên ajax phương thức push
        $.ajax({
            type: "DELETE",
            url: `http://amis.manhnv.net/api/v1/Employees/${this.employeeIDSelected}`,
            async: false,
            success: function(response) {

            }
        });
    }
    // Hiện toast-msg thông báo "xóa thành công"
    $('.m-toast-msg-delete').show();
    setTimeout(() => {
        $('.m-toast-msg-delete').hide();
    }, 3000);
    // Ẩn modal
    $('.m-background-modal').hide();
    // Ẩn btn xóa hàng loạt
    debugger
    $('#btnAllDelete').hide();
    // Load lại dữ liệu
    that.currentPageIndex = 1;
    that.loadData();
}

function reloadData() {
    debugger
    this.currentPageIndex = 1;
    $('#txtSearch').attr({ 'value': '' });
    this.loadData();
}