$(document).ready(function() {
    //--------------------------------------------------
    // Событие клик мыши +
    $(document).mouseup(function(e) {
        var mytd = $('td.active');
        var myredaction = $('.redaction');
        var myoften = $('.often');
        if (!mytd.is(e.target) &&
            mytd.has(e.target).length === 0 &&
            !myredaction.is(e.target) &&
            myredaction.has(e.target).length === 0 &&
            !myoften.is(e.target) &&
            myoften.has(e.target).length === 0) {
            $('td').removeClass('switch');
            outFromObject(mytd, 'td');
        }
    });

    //--------------------------------------------------
    // Редактирование ячейки таблицы +
    $('td').click(function() {
        if ($(this).attr('contenteditable') == 'true') {
            createNewDiv(this.id);
        }
        //----------------------------------------
    });

    //--------------------------------------------------
    // Отображение текста из ячейки таблицы в поле редактирования +
    $('td').keyup(function(event) {
        var value = $(this).text();
        $(".redaction").text(value);
    })

    //--------------------------------------------------
    // Нажатие клавиши enter +
    document.addEventListener('keydown', (event) => {
        if (event.which === 13) {
            event.preventDefault();
            if ($(document.activeElement).is('td')) {
                outFromObject('td.active', 'td');
            } else {
                if ($(document.activeElement).is('.redaction')) {
                    outFromObject('.redaction', '.redaction');
                } else {
                    if ($('td').hasClass('switch')) {
                        function setCursor(contentEditableElement, position) {
                            let range = document.createRange();
                            let selection = window.getSelection();
                            range.setStart(contentEditableElement, position);
                            range.setEnd(contentEditableElement, position);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                        if ($('td.switch').attr('contenteditable') == 'true') {
                            var activetd = $('td.switch').attr('id');
                            createNewDiv(activetd);
                            var editableDiv = document.querySelector('.redaction');
                            var len = $('.redaction').text().length;
                            setCursor(editableDiv.firstChild, len);
                        }
                    }
                }
            }
        }
    });

    //--------------------------------------------------
    // Нажатие кнопки myplus2 -
    $('.myplus2').click(function() {
        number = getNumberNewStr();
        $('div#edt-dv').detach();

        var ids = $('td').map(function(_, x) { return x.id.replace(/_[0-9]/g, ''); }).get();
        const only_id = unDuplicateArraySingleValues(ids);

        var inserted_data = '';
        for (var i = 0; i < only_id.length; i++) {
            inserted_data +=  '<td contenteditable="true" class="edit" value="" id="' + only_id[i] + "_" + number + '"></td>'
        }
        var new_row = $('<tr>' + '<th class="class_id">' + number + '</th>' + inserted_data + '</tr>');
        $('tbody').append(new_row);

        var tableName = $('.tableName').attr('id');
        var url = '/new_line_' + tableName
        $.ajax({
            url: url,
            type: 'post',
            data: { id: number }
        });

        $('td').click(function() {
            createNewDiv(this.id);
        });

        $('td').keyup(function(event) {
            var value = $(this).text();
            $(".redaction").text(value);
        })
        //----------------------------------------
    });

    //--------------------------------------------------
    // Событие "Кнопки" +
    document.onkeydown = function(event) {
        if (!$(document.activeElement).is('.redaction') && !$(document.activeElement).is('td')) {
            var retval = []
            $('td').each(function() {
                retval.push($(this).attr('id'))
            })

            var clearretval = []
            var clearnumber = []
            for (var i = 0; i < retval.length; i++) {
                var split_id = retval[i].split("_");
                var field_name = split_id[0];
                var number_name = split_id[1];
                clearretval.push(field_name);
                clearnumber.push(number_name);
            }

            const noDupStrings = unDuplicateArraySingleValues(clearretval);
            const noDupNumber = unDuplicateArraySingleValues(clearnumber);

            if (!$('td').hasClass('switch')) {
                var currentX = noDupStrings[0];
                var currentY = noDupNumber[0];
                coord = currentX + '_' + currentY;

                switch (event.keyCode) {
                    case 37:
                        repaint(coord);
                        break;
                    case 38:
                        repaint(coord);
                        break;
                    case 39:
                        repaint(coord);
                        break;
                    case 40:
                        repaint(coord);
                        break;
                }
            } else {
                var activetd = $('td.switch').attr('id');
                var split_activetd = activetd.split("_");
                var textactive = split_activetd[0];
                var numberactive = split_activetd[1];
                var currentX = noDupStrings.indexOf(textactive);
                var currentY = numberactive;
                var coord = '';

                switch (event.keyCode) {
                    case 37:
                        if (currentX > 0) {
                            currentX--;
                            coord = noDupStrings[currentX] + '_' + currentY;
                            repaint(coord);
                        }
                        break;
                    case 38:
                        if (currentY > 1) {
                            currentY--;
                            coord = noDupStrings[currentX] + '_' + currentY;
                            repaint(coord);
                        }
                        break;
                    case 39:
                        if (currentX < noDupStrings.length - 1) {
                            currentX++;
                            coord = noDupStrings[currentX] + '_' + currentY;
                            repaint(coord);
                        }
                        break;
                    case 40:
                        if (currentY < noDupNumber.length) {
                            currentY++;
                            coord = noDupStrings[currentX] + '_' + currentY;
                            repaint(coord);
                        }
                        break;
                }
            }

            function repaint() {
                $('td').blur();
                switchkeys(coord);
            }
        }
    };

    //--------------------------------------------------

    // Блок для создания новой строки и обработки новых ячеек в таблице +

    let popupBg = document.querySelector('.popup__bg');
    let popup = document.querySelector('.popup');
    let openPopupButtons = document.querySelectorAll('div.myplus');
    let closePopupButton = document.querySelector('.close-popup');
    let continueWithoutLink = document.querySelector('.no-link');
    let continueWithLink = document.querySelector('.with-link');

    openPopupButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            popupBg.classList.add('active');
            popup.classList.add('active');
        })
    });

    closePopupButton.addEventListener('click',() => {
        popupBg.classList.remove('active');
        popup.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if(e.target === popupBg) {
            popupBg.classList.remove('active');
            popup.classList.remove('active');
        }
    });

    continueWithoutLink.addEventListener('click',() => {
        popupBg.classList.remove('active');
        popup.classList.remove('active');
        
        number = getNumberNewStr();
        $('div#edt-dv').detach();

        var ids = $('td').map(function(_, x) { return x.id.replace(/_[0-9]/g, ''); }).get();
        const only_id = unDuplicateArraySingleValues(ids);

        var inserted_data = '';
        for (var i = 0; i < only_id.length; i++) {
            inserted_data +=  '<td contenteditable="true" class="edit" value="" id="' + only_id[i] + "_" + number + '"></td>'
        }
        var new_row = $('<tr>' + '<th class="class_id">' + number + '</th>' + inserted_data + '</tr>');
        $('tbody').append(new_row);

        var tableName = $('.tableName').attr('id');
        var url = '/new_line_' + tableName
        $.ajax({
            url: url,
            type: 'post',
            data: { id: number }
        });

        $('td').click(function() {
            createNewDiv(this.id);
        });

        $('td').keyup(function(event) {
            var value = $(this).text();
            $(".redaction").text(value);
        })
    });

    continueWithLink.addEventListener('click',() => {
        popupBg.classList.remove('active');
        popup.classList.remove('active');

        number = getNumberNewStr();
        var url = document.getElementById("url").value;
        var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (url != "") {
            if (!regexp.test(url)) {
                alert("Некорректная ссылка.");
            } else {
                window.location.assign(url);
                $.ajax({
                    url: '/addDataFromLink',
                    type: 'post',
                    async: false,
                    data: { id: number, url: url }
                });
            }
        }
        else {
            alert("Ссылка отсутствует.");
        }
    });

    // Конец блока для создания новой строки и обработки новых ячеек в таблице

    //--------------------------------------------------

    // Блок обработки нажатия кнопки "Редакторы"

    let editors_popupBg = document.querySelector('.editors_popup__bg');
    let editors_popup = document.querySelector('.editors_popup');
    let editors_openPopupButtons = document.querySelectorAll('#btn_editors');
    let editors_closePopupButton = document.querySelector('.editors_close-popup');

    editors_openPopupButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            editors_popupBg.classList.add('active');
            editors_popup.classList.add('active');
        })
    });

    editors_closePopupButton.addEventListener('click',() => {
        editors_popupBg.classList.remove('active');
        editors_popup.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if(e.target === editors_popupBg) {
            editors_popupBg.classList.remove('active');
            editors_popup.classList.remove('active');
        }
    });

});

//--------------------------------------------------
// Functions:

function unDuplicateArraySingleValues(array) {
    // Проверка, что это не пустой массив
    if ((Array.isArray(array) || array instanceof Array) && array.length) {
        // Возвращает массив уникальных значений
        return [...new Set(array)];
    } else {
        // Это не заполненный массив,
        // возвращаем переданное без изменений
        return array;
    }
}

socket.on('message', function(data) {
    var id = data.id;
    var value = data.value;
    $("td#" + id).text(value);
})

socket.on("editors", function(data){
    var usernames = data.all_users
    $('.editors_label__text2').detach();
    var new_div ='';
    for (var i = 0; i < usernames.length; i++) {
        new_div += '<div class="editors_label__text2" id="' + usernames[i] + '">' + usernames[i] + '</div>'
    }
    $("label#editors_for_table").append(new_div);
})

socket.on("block_td", function(data){
    var td_id = data.td_id
    $('td#' + td_id).attr('contenteditable', false);
    $('td#' + td_id).addClass('block');
})

socket.on("anblock_td", function(data){
    var td_id = data.td_id
    $('td#' + td_id).attr('contenteditable', true);
    $('td#' + td_id).removeClass('block');
})

function outFromObject(tagOne, tagTwo) {
    $('div#edt-dv').detach();
    var id = $(tagOne).attr('id');
    if(typeof id != "undefined") {
        socket.emit('td_anblock', {'td_id': id, 'room': window.location.pathname});
        var split_id = id.split("_");
        var field_name = split_id[0];
        var edit_id = split_id[1];
        var value = $(tagOne).text();
        $('td').removeClass('active');
        $('.bagredaction').removeClass('active');
        $('.redaction').attr('contenteditable', false);
        //$(tagTwo).attr('contenteditable', false);
        $(tagOne).blur();

        var tableName = $('.tableName').attr('id');
        var url = '/update_' + tableName

        socket.emit('message', {'id': id, 'value': value, 'room': window.location.pathname});

        $.ajax({
            url: url,
            type: 'post',
            data: { field: field_name, value: value, id: edit_id }
        });
    }
}

function getNumberNewStr() {
    var thtext = $('th.class_id').text();
    var x = thtext.length;
    if (x > 189) {
        var number = Number(thtext.slice(-3));
    } else if (x > 9) {
        var number = Number(thtext.slice(-2));
    } else {
        var number = Number(thtext.slice(-1));
    }
    number++; 
    return number;
}

function switchkeys(objectId) {
    $('td').removeClass('switch');
    $('td#' + objectId).addClass('switch');
}

function createNewDiv(objectId) {
    $('td').removeClass('active');
    $('td#' + objectId).addClass('active');
    //$('td').attr('contenteditable', true);
    $('.redaction').attr('contenteditable', true);
    $('.bagredaction').addClass('active');

    socket.emit('td_event', {'td_id': objectId, 'room': window.location.pathname});

    $('div#edt-dv').detach();

    var value = $('td#' + objectId).text();
    $(".redaction").text(value);
    $(".redaction").attr('id', objectId);


    $('.redaction').keyup(function(event) {
        var tdvalue = $('.redaction').text();
        $('td.active').text(tdvalue);
    })

    var id = objectId;
    var split_id = id.split("_");
    var field_name = split_id[0];
    var thtext = $('th').text();
    var number = thtext.slice(-1);
    number++;

    var textFromTd = [];
    for (var i = 1; i < number - 1; i++) {
        var td_id = '#' + field_name + '_' + i + '';
        var td_text = $(td_id).text();
        textFromTd.push(td_text);
    }

    const noDupStrings = unDuplicateArraySingleValues(textFromTd);

    var top = $('td#' + objectId).offset().top;
    var bottom = top + $('td#' + objectId).innerHeight();
    var left = $('td#' + objectId).offset().left - 100;
    var inserted_data = '';
    for (var i = 0; i < noDupStrings.length; i++) {
        inserted_data += '<div class="often">' + noDupStrings[i] + '</div>'
    }
    var newDiv = $('<div class="edt-dv-tw edt-div notd" id="edt-dv">' +
        inserted_data +
        '</div>');

    $(newDiv).offset({ top: bottom, left: left });
    $('body').append(newDiv);

    $('.often').click(function() {
        var value = $(this).text();
        $('td.active').text(value);
        $(".redaction").text(value);
    })
}