import './styles/dashboard.css';
import './styles/dropzone.css';
import $ from 'jquery';
import './styles/media_edit.css';
function reloadMedia(){
    const url = "/api/tipanel_media/";
    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            $('#ti-dashboard-container').html(data);
        },
        error: function() {
            alert('Error loading content.');
        }
    });
}
function reloadPages(){
    const url = "/api/page_list";
    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            $('#ti-dashboard-container').html(data);
        },
        error: function() {
            alert('Error loading content.');
        }
    });
}
$('.load-page').on('click', function(event) {
    event.stopPropagation();
    const url = $(this).attr('data-url');
    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            $('#ti-dashboard-container').html(data);
        },
        error: function() {
            alert('Error loading content.');
        }
    });
});
$('.ti-dashboard-page').on('mouseenter', function() {
    $(this).children('.ti-dashboard-page-submenu').toggle();
});
$('.ti-dashboard-page').on('mouseleave', function() {
    $(this).children('.ti-dashboard-page-submenu').toggle();
});

var id, src, alt, desc, title;
$(document).on('click', '.gallery-image', function(event) {
    id = $(this).attr('data-id');
    src = $(this).attr('src');
    alt = $(this).attr('alt');
    desc = $(this).attr('description');
    title = $(this).attr('title');

    let editModal = `<div class="modal"><div class="modal-header"><h1>Edit image</h1><button id="x-button"><span class="material-symbols-outlined">close</span></button></div><div class="modal-container"><div class="image-container"><img src="${src}"></div><div class="settings"><input type="hidden" id="id" value="${id}"><label for="title">Put your image title here.</label><input type="text" id="title" value="${title}"><label for="alt">Put your image alternative text here.</label><textarea id="alt">${alt}</textarea><label for="description">Put your image description here</label><textarea id="description">${desc}</textarea><div class="m-buttons"><button id="delete" class="dropzone-btn bg-red">Delete</button><button type="submit" id="submit" class="dropzone-btn">Save</button></div></div></div></div><div id="modal-close"></div>`
    $('body').append(editModal);
    
});
$(document).on('click', '#submit', function() {
    let dataToSend = { id: $('#id').val() };
    dataToSend.alt = $('#alt').val();
    dataToSend.desc = $('#description').val();
    dataToSend.title = $('#title').val();

    $.ajax({
        url: '/api/tipanel_media_edit/',
        method: 'GET',
        data: dataToSend,
        success: function() {
            $('.modal, #modal-close').remove();
            reloadMedia();
        },
        error: function() {
            alert('Error loading content.');
        }
    });
});
$(document).on('click', '#x-button, #modal-close', function() {
    $('.modal, #modal-close').remove();
});
$(document).on('click', '#modal-close', function() {
    $('.modal, #modal-close').remove();
});
$(document).on('click', '#delete', function(event) {
    event.stopPropagation();
    let dataToSend = { id: $('#id').val() };

    $.ajax({
        url: '/api/tipanel_media_delete/',
        method: 'GET',
        data: dataToSend,
        success: function() {
            $('.modal, #modal-close').remove();
            reloadMedia();
        },
        error: function() {
            alert('Error loading content.');
        }
    });
});
$(document).on('click', '#add-page', function() {
    let addPageModal = `<div class="ti-w-25 ti-h-min modal ti-absolute-center"><div class="modal-header"><h1>Add new page</h1><button id="x-button"><span class="material-symbols-outlined">close</span></button></div><div class="modal-container"><div class="settings ti-w-100 ti-pb-4"><label for="title">Put your page title here.</label><input type="text" id="title"><label for="route">Put route to new page here. ex. /about-us. </label><input id="route" type="text"><div class="m-buttons"><button type="submit" id="submit-add-page" class="ti-btn">Save</button></div></div></div></div><div id="modal-close"></div>`
    $('body').append(addPageModal);
});
$(document).on('mouseenter', '.ti-page', function() {
    let pageOptions = `<div id="ti-page-options"><a>Edit</a><a class="text-red">Delete</a><a href="/edit/${$(this).children('.ti-page-name').text()}">Edit content</a></div>`;
    $(this).children('.ti-page-title').append(pageOptions);
});
$(document).on('mouseleave', '.ti-page', function() {
    $(this).children('.ti-page-title').children('#ti-page-options').remove();
});
$(document).on('click', '#submit-add-page', function() {
    let dataToSend = { title: $('#title').val(), route: $('#route').val()};

    $.ajax({
        url: '/api/tipanel_add_page/',
        method: 'GET',
        data: dataToSend,
        success: function() {
            $('.modal, #modal-close').remove();
            reloadPages();
        },
        error: function() {
            alert('Error loading content.');
        }
    });
});