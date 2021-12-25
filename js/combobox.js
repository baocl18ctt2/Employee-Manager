$(document).ready(function() {
    new TableHeader();
    // Lưu trữ thông tin combobox data:
    let comboboxs = $('.mcombobox');
    for (const combobox of comboboxs) {
        if (!$(combobox).is('#cbxHeader')) {
            let itemDataElement = $(combobox).find('.m-combobox-data').html();
            $(combobox).data("itemDataElement", itemDataElement);
            $(combobox).attr("itemDataElement", itemDataElement);
            // $(combobox).attr({ "itemDataElement": itemDataElement });
            // Xóa item trong data combobox
            $(combobox).find('.m-combobox-data').empty();
        }
    }
});

class TableHeader {
    nameCompany = null;
    thCurrent = null;
    // Khởi tạo tên đơn vị và công ty tương ứng
    company = {
        'quiphuc': 'Công ty TNHH Sản xuất - Thương mại - Dịch vụ qui phúc',
        '02001': 'Cửa hàng số 1',
        '02002': 'Cửa hàng số 2',
        '02003': 'Cửa hàng số 3',
        '02004': 'Cửa hàng số 4',
        '02005': 'Cửa hàng số 5',
        '0206': 'Cửa hàng số 6',
        '02007': 'Cửa hàng số 7',
        '02008': 'Cửa hàng số 8',
        '02009': 'Cửa hàng số 9',
        '02010': 'Cửa hàng số 10',
    }
    constructor() {
        // Xét mặc định tên công ty
        $('.m-select-brank-work *').find('.mcombobox').children('input').val('Công ty TNHH Sản xuất - thương mại - dịch vụ qui phúc');
        $('.m-select-brank-work *').find('.mcombobox').children('input').attr({
            'value': 'quiphuc'
        });
        this.loadCompany();
        this.initEvent();

    }
    initEvent() {
        // Bắt sự kiện với nút btn-icon-down
        $('#cbxHeader .m-btn-icon').click(showComboboxDataHeader.bind(this));
        // Bắt sự kiện khi click vào item table
        $('table#tblHeader').on('click', 'tbody tr', showNameCompany.bind(this));
        // Bắt sự kiện đổi tên company
        $('#tblCompany').click(function() {
            $('.m-select-brank-work').toggle();
        });
        // Thao tác khi bấm kí tự input combobox
        $(".mcombobox input").keydown(inputComboboxOnKeydown);
        $(".mcombobox input").keyup(inputComboboxOnKeyup);
    }
    loadCompany() {
        // Lấy phần tử mà ta sẽ append vào
        let tbodyHTML = $('#tblHeader tbody');
        for (const [code, name] of Object.entries(this.company)) {
            let trHTML = $(`<tr>
                            <th class ="m-text-allign-left m-padding-20" style="width: 100px; ">${code}</th>
                            <th class ="m-text-allign-left">${name}</th>
                        </tr>`);
            tbodyHTML.append(trHTML);
            trHTML.attr({ 'value': code });
        }

    }
}

function showNameCompany(sender) {
    let rowCurrent = sender.currentTarget;
    // Lấy ra text trong tên đơn vị vaf giá trị value tương ứng với mã code
    this.nameCompany = $(rowCurrent).children()[1].textContent;
    let value = $(rowCurrent).attr('value');
    // Hiển thị tên công ty lấy ra và ghi vào thẻ input
    $(rowCurrent).parents('.mcombobox').children('input').val(this.nameCompany);
    $(rowCurrent).parents('.mcombobox').children('input').attr({ 'value': value });
    // Xóa class thêm màu ở thCurrent
    $(this.thCurrent).removeClass('add-color');
    // Ẩn combobox data
    $(rowCurrent).parents('.m-combobox-data').hide();
    // Xoay icon down 90độ
    debugger
    $('.m-btn-icon').removeClass('m-btn-icon-transform');
    // Hiển thị tên Công ty vào phần header
    $('#nameCompany').html(this.nameCompany);


}

function showComboboxDataHeader(sender) {
    let rowCurrent = sender.currentTarget;
    // Xoay nút 180 độ
    $(rowCurrent).addClass('m-btn-icon-transform');
    // Lấy value trong thẻ input
    let inputValue = $(rowCurrent).parents('.mcombobox').children('input').attr('value');
    // Hiển thị combobox data
    $(rowCurrent).parent().siblings('.m-combobox-data').toggle();
    // Tìm kiếm tương ứng với giá trị input
    let ths = $('table#tblHeader tbody').children();
    for (const th of ths) {
        let thValue = $(th).attr('value');
        if (inputValue == thValue) {
            debugger
            // Lưu lại th hiện có
            this.thCurrent = th;
            // Thêm class hiển thị màu sắc trùng với dữ liệu input
            $(th).addClass('add-color');
            break;
        }
    }
}

/*
 * Tạo sự kiện bấm phím vào thẻ input combobox 
 */
function inputComboboxOnKeydown(event) {
    debugger
    // Hiển thị đúng combobox data đang nhập
    $(this).siblings('.m-combobox-data').show();
    // Lấy tất cả các item trong data combobox
    let items = $(this).siblings('.m-combobox-data').children();
    // Lấy ra itemHoverred hiện tại
    let itemHoverred = $(items).filter('.m-combobox-item-hover');

    switch (event.keyCode) {
        case 40: // Nhấn phím xuống
            if (itemHoverred.length > 0) {
                debugger
                // Lấy ra itemHoverred kết tiếp
                let nextItemHoverred = itemHoverred.next();
                // focus vào item kết tiếp này
                $(nextItemHoverred).addClass('m-combobox-item-hover');
                // Xóa class item trước đó
                $(itemHoverred).removeClass('m-combobox-item-hover');
            } else {
                debugger
                let firstItem = items[0];
                // Mặc định focus vào item đầu tiên trong combobox data
                $(firstItem).addClass('m-combobox-item-hover');
            }
            break;

        case 38: // Nhấn phím lên
            if (itemHoverred.length > 0) {
                debugger
                // Lấy ra itemHoverred kết tiếp
                let prevItemHoverred = itemHoverred.prev();
                // focus vào item kết tiếp này
                $(prevItemHoverred).addClass('m-combobox-item-hover');
                // Xóa class item trước đó
                $(itemHoverred).removeClass('m-combobox-item-hover');
            } else {
                // Lấy ra item cuối cùng
                let lastItem = items[items.length - 1];
                $(lastItem).addClass('m-combobox-item-hover');
            }
            break;
        case 13: // Khi nhấn nút enter
            if (itemHoverred.length == 1) {
                debugger
                // Lấy text và value trong item-combobox
                let text = $(itemHoverred).text();
                let value = $(itemHoverred).attr('value');
                // Điền thông tin vào thẻ input 
                $(this).val(text);
                $(this).parent('.mcombobox').data('value', value);
                // Ẩn combobox data
                $(this).siblings('.m-combobox-data').hide();
            }
            break;
        default:
            debugger
            break;
    }
}

function inputComboboxOnKeyup() {
    debugger
    switch (event.keyCode) {
        case 13:
        case 40:
        case 38:
            break;
        default:
            // $(this).siblings('.m-combobox-data').empty();
            // Lấy value đã lưu trong data combobox
            let itemDataElement = $(this.parentElement).data('itemDataElement');
            // Build html cho các combobox data item:
            $(this).siblings('.m-combobox-data').html(itemDataElement);
            // Nếu người dùng nhập kí tự khác
            // 1. Lấy ra giá trị và người dùng nhập vào
            let value_user = $(this).val();
            // 2. So sánh với từng item trong data combobox
            let items = $(this).siblings('.m-combobox-data').children();
            for (const item of items) {
                debugger
                let text = $(item).text();
                text = text.toLowerCase(); // chuyển về chữ thường
                if (!text.includes(value_user.toLowerCase())) {
                    item.remove();
                }
            }
            // Hiển thị data combobox sau khi lọc
            $(this).siblings('.m-combobox-data').show();
            break
    }
}

$('.mcombobox .m-btn-icon').click(function() {
    if (!$(this).parents('.mcombobox').is('#cbxHeader')) {
        // Lấy value đã lưu trong data combobox
        let itemDataElement = $(this).parents('.mcombobox').data('itemDataElement');
        // Build html cho các combobox data item:
        $(this).parent().siblings('.m-combobox-data').html(itemDataElement);
        // Hiển thị combobox data đúng combobox hiện tại 
        // 1- Hiển  thị combobox data đang trỏ tới
        $(this).parent().siblings('.m-combobox-data').toggle();
    }
})


/**
 * Hàm getItemOnClick: sẽ lấy ra items và hiển thị lên input-combobox
 */
function getItemOnClick() {
    // Hiển thị items ở text lên input combobox:
    // 1 - Lấy text trong item vừa chọn
    // Dùng js: this.textContent
    const text = $(this).text();
    // 2 - Lấy value trong item vừa chọn
    //Dùng js: this.getAttribute('value');
    const value = $(this).attr('value');
    // hiển thị text đã lấy và hiển thị lên thẻ input
    $(this).parent().siblings('input').val(text);
    // Lấy ra value combobox
    // C1: -Lấy ra value và hiển thị trên thẻ HTML
    $(this).parents('.mcombobox').attr('value', value);
    // C2: - Lấy ra value nhưng ko hiển thị lên HTML
    $(this).parents('.mcombobox').data('value', value);
    // Lấy ra fieldName tương ứng
    $(this).parents('.mcombobox').attr('nameValue', text);
    // Tắt combobox-data
    $(this).parent().hide();
}
``

// Bắt sự kiện với khi click vào items()
// $('.mcombobox .m-combobox-item').click(getItemOnClick);
$('.mcombobox').on('click', '.m-combobox-item', getItemOnClick);