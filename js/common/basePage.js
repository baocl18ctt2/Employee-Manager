class basePage {
    currentPageIndex = 1;
    maxPageIndex = 4;
    totalPage = 1;
    TableID = null;
    NameObjectID = null;
    urlAPiPage = null;
    searchText = '';
    constructor(TableID, NameObjectID, urlAPiPage) {
        this.TableID = TableID;
        this.NameObjectID = NameObjectID;
        this.urlAPiPage = urlAPiPage;
        this.loadData();
    }

    ajaxAPI(parameter) {
        // kết quả biến trả về
        let result = null;
        console.log(this.urlAPiPage);
        $.ajax({
            type: "GET", // POST: thêm mới, PUT: chỉnh sửa, DEL: xóa.
            url: `${this.urlAPiPage}/${parameter}`,
            // data: "data", // Tham số truyền lên cho API, khi nào cần thêm, xóa, xủa thì đùng đến nó.
            // dataType: "json",
            // contentType: "application/json",
            async: false,
            success: function(response) {
                result = response;
            },
            error: function(response) {
                result = 0;
                // alert("Lấy dữ liệu thất bại.");
            }
        });
        return result;
    }

    ajaxDepartment(paramater) {
        // kết quả biến trả về
        let result = null;
        $.ajax({
            type: "GET", // POST: thêm mới, PUT: chỉnh sửa, DEL: xóa.
            url: `http://amis.manhnv.net/api/v1/Departments/${paramater}`,
            // data: "data", // Tham số truyền lên cho API, khi nào cần thêm, xóa, xủa thì đùng đến nó.
            dataType: "json",
            contentType: "application/json",
            async: false,
            success: function(response) {
                result = response;
            },
            error: function(response) {

                result = 0;
                // alert("Lấy dữ liệu thất bại.");
            }
        });
        return result;
    }
    ajaxPosition(paramater) {
        // kết quả biến trả về
        let result = null;
        $.ajax({
            type: "GET", // POST: thêm mới, PUT: chỉnh sửa, DEL: xóa.
            url: `http://amis.manhnv.net/api/v1/Positions/${paramater}`,
            // data: "data", // Tham số truyền lên cho API, khi nào cần thêm, xóa, xủa thì đùng đến nó.
            dataType: "json",
            contentType: "application/json",
            async: false,
            success: function(response) {

                result = response;
            },
            error: function(response) {
                result = 0;
                // alert("Lấy dữ liệu thất bại.");
            }
        });
        return result;
    }


    loadData() {
        debugger
        //Làm sạch dữ liệu
        $(`#${this.TableID} tbody`).empty();
        // Làm sạch paging talbe
        $('.m-content-footer-page .m-pagging-number').empty();
        // lay du lieu
        let data = [];
        // Lấy các thông tin thực hiện phân trang
        this.searchText = $('#txtSearch').attr('value');
        const pageSize = $('#cbxPageSize').children('.m-combobox-text').attr('value');
        const pageNumber = this.currentPageIndex;
        this.searchText = (this.searchText ? this.searchText : "");
        let apiUrl = `http://amis.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${pageNumber}&employeeFilter=${this.searchText}`;

        // Gọi lên api lấy dữ liệu -> sử dụng jquery ajax
        // data = this.ajaxAPI('filter?pageSize=', pageSize, pageNumber);
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            success: function(response) {
                data = response;
            }
        });
        // Thực hiện tính toán các số liệu để hiển thị lên giao diện (tổng số bản ghi, thông tin index của bản ghi)
        const totalRecord = data.TotalRecord;
        this.totalPage = data.TotalPage;
        $('.lenItem').text(totalRecord);

        // Tính toán việc hiển thị số trang trong Pagingbar

        if (this.currentPageIndex == 1) {
            if (this.maxPageIndex < this.totalPage) {

                for (let index = 0; index < this.maxPageIndex - 1; index++) {
                    let buttonHTML = $(`<div>
                                            <div class="m-number">${index+1}</div>               
                                        </div>`);
                    buttonHTML.attr('value', index + 1);
                    $('.m-content-footer-page .m-pagging-number').append(buttonHTML);
                    // this.curremtPageIndex += 1;
                }
                // Trang cuối cùng là in ra phần tử lớn nhaats trong totalPage
                // Trước khi in ra trang cuối cùng thì thêm phần tử vào trước đó
                let daubacham = $(`<div class="m-number m-number-bacham">...</div>`);

                $('.m-content-footer-page .m-pagging-number').append(daubacham);
                let buttonHTML = $(`<div>
                                        <div class="m-number">${this.totalPage}</div>               
                                    </div>`);
                buttonHTML.attr('value', this.totalPage);
                $('.m-content-footer-page .m-pagging-number').append(buttonHTML);

            } else {
                for (let index = 0; index < this.totalPage; index++) {
                    let buttonHTML = $(`<div>
                                            <div class="m-number">${index+1}</div>               
                                        </div>`);
                    buttonHTML.attr('value', index + 1);
                    $('.m-content-footer-page .m-pagging-number').append(buttonHTML);
                }
            }
        } else {

            // for (let index = 0; index < this.totalPage; index++) {
            //     let buttonHTML = $(`<div>
            //                             <div class="m-number">${index+1}</div>               
            //                         </div>`);
            //     buttonHTML.attr('value', index + 1);
            //     $('.m-content-footer-page .m-pagging-number').append(buttonHTML);
            // }
            let text = $('.m-pagging-number').attr('textPaggingNumber');
            $('.m-pagging-number').append(text);
        }

        // Xóa hết add-border-items
        $('.m-content-footer-page .m-pagging-number').children().filter('.add-border-items').removeClass('add-border-items');

        // thêm class hiển thị trang hiện tại đang trỏ tới
        let list_item_paging = $('.m-content-footer-page .m-pagging-number').children();
        for (const item of list_item_paging) {
            // lấy ra giá trị value của item
            let value = $(item).attr('value');
            if (pageNumber == value) {
                $(item).addClass('add-border-items');
                break;
            }
        }
        debugger
        // Kiểm tra trang hiện tại có phải là trang cuối cùng hay không?
        if (this.currentPageIndex != this.totalPage) {
            $('#btnAfterPaging').addClass('m-number-text-after');
        } else {
            $('#btnAfterPaging').removeClass('m-number-text-after');
        }
        // Nếu trang hiện tại bằng 1 thì ẩn chữ before
        if (this.currentPageIndex != 1) {
            $('#btnBeforePaging').addClass('m-number-text-before');
        } else {
            $('#btnBeforePaging').removeClass('m-number-text-before');
        }

        // Xac dinh du lieu điền trong các cột
        let allColName = $(`#${this.TableID} th[fieldName]`);
        // lấy entityID để xác định khóa chính của các dòng dữ liệu trong table
        let entityID = $(`table#${this.TableID}`).attr('entityID');

        // thêm data vào
        data = data.Data;
        // Build table
        data.forEach(object => {
            // Tạo trHTML
            let tdHTML = [];
            // Đưa checkbox vào đầu
            tdHTML.push(`<td  class="checkSelected" style="column-width: 3%;">
                                <div class="ms-checkbox ms-checkbox-item">
                                    <div class="m-checkbox-active"></div>
                                </div>
                        </td>`)
            for (const colName of allColName) {
                // Lấy cột nameFiled;
                let nameField = $(colName).attr('fieldName');
                let value = object[nameField];

                if (nameField == 'DateOfBirth') {
                    let date = new TimeDate(value);
                    value = `${date.transformDay()}/${date.transformMonth()}/${date.transformYear()}`;
                }
                if (nameField == 'NameBank') {
                    value = '';
                }
                // Lấy ra style tương ứng với cột đó
                let attrClass = $(colName).attr('class');
                // Lấy ra style tương ứng với cột đó
                let style = $(colName).attr('style');
                // Tạo từng element td
                tdHTML.push(`<td class=${attrClass} style=${style}>${value}</td>`);
            }
            tdHTML.push(`<td class="m-text-algin-center checkSelected"" style="width: 10%;">
                            <div class="m-features">
                                <div class="m-features-text" value="4">Sửa</div>
                                <div>
                                    <div class="m-icon-dropdown"></div>
                                </div>
                                <!-- Phần hiển thị các tính năng -->
                                <div class="m-features-grid">
                                    <div class="m-one-features" value="0">Nhân bản</div>
                                    <div class="m-one-features" value="1">Xóa</div>
                                    <div class="m-one-features" value="2">Ngừng sử dụng</div>
                                </div>
                            </div>
                        </td>`);
            //Tạo thành các chuỗi HTML
            tdHTML = tdHTML.join('');
            let trHTML = $(`<tr class="ms-checkbox-false">${tdHTML}</tr>`);
            // Lưu employeeID
            trHTML.data(`${this.NameObjectID}`, object[entityID]);
            trHTML.attr(`${this.NameObjectID}`, object[entityID]); // hiển thị để nhìn cho rõ
            // Binding dữ liệu lên table
            $(`table#${this.TableID} tbody`).append(trHTML);
        });
    };
}