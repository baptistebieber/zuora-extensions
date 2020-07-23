username = '';
account_configuration = {};

function open_modale() {
    $('#menu_name').val('');
    $('#modal_div').show();
    $('#menu_name').focus();
}

function open_modale_execute() {
    $('#modal_exec_div').show();
}

function set_type_modale(type) {
    $('#modal_div').attr('nz-type', type);
}

function get_type_modale() {
    return $('#modal_div').attr('nz-type');
}

function close_modale() {
    $('#modal_div').hide();
}

function generate_modale() {
    $('body').append('<div id="modal_div" style="display:none;"></div>');
    $('#modal_div').append('<div id="fond_modal" style="position: absolute;width: 100%;height: 100%;background-color: grey;opacity: 0.4;"></div>');
    $('#modal_div').append('<div id="modal" style="position: absolute;width: 50%;top: 150px;margin-left: 25%;"></div>');
    $('#modal').append('<input id="menu_name" type="text" name="menu_name" style="width: 100%" />');
    $('#fond_modal').click(function() {
        close_modale();
    });
    
    $('#menu_name').keypress(function(e) {
        if($('#menu_name').val() !== '') {
            if(e.keyCode == 13) {
                close_modale();
                if( get_type_modale() === 'add_menu') {
                  add_to_menu();
                }
                else if( get_type_modale() === 'import_export_menu') {
                  clear_menu();
                  account_configuration = JSON.parse($('#menu_name').val());
                  localStorage.setItem(username, JSON.stringify(account_configuration));
                  generate_all_menu();
                }
            }
        }
        if(e.keyCode == 27) {
            close_modale();
        }
    });
}

function new_elem_menu(k, name, link) {

    $('#nz-menu').append($('<a id="link_'+k+'" href="'+link+'">'+name+'</a>'));
}

function clear_menu() {
    account_configuration.links = [];
    localStorage.setItem(username, JSON.stringify(account_configuration));
    $('a[id^=link_]').remove();
}

function generate_all_menu() {
    if(account_configuration.links !== undefined && (typeof account_configuration.links) === 'object') {
        for(var k in account_configuration.links) {
            var link = account_configuration.links[k];
            new_elem_menu(k, link.name, link.link);
        }
    }
}

function add_to_menu() {
    if(account_configuration.links === undefined || (typeof account_configuration.links) !== 'object') {
        account_configuration.links = [];
    }
    var name = $('#menu_name').val();
    account_configuration.links.push({
        link: location.pathname,
        name: name
    });
    localStorage.setItem(username, JSON.stringify(account_configuration));
    console.log(account_configuration);
    
    new_elem_menu(account_configuration.links.length, name, location.pathname);
}

function add_menu() {
    console.log($('zal-banner'));
    $('zal-banner').append($('<div id="nz-menu"></div>'));
    generate_all_menu();
    $('#nz-menu').append($('<a id="import_export_menu" class="gwt-Anchor" href="#">Import/Export</a></li>'));
    $('#nz-menu').append($('<a id="delete_from_menu" class="gwt-Anchor" href="#">Clear</a></li>'));
    $('#nz-menu').append($('<a id="add_to_menu" class="gwt-Anchor" href="#">+ Add to Menu</a></li>'));
    $('#add_to_menu').click(function(event) {
        event.preventDefault();
        set_type_modale('add_menu');
        open_modale();
    });
    
    $('#delete_from_menu').click(function(event) {
        event.preventDefault();
        clear_menu();
        return;
    });

    $('#import_export_menu').click(function(event) {
        event.preventDefault();
        set_type_modale('import_export_menu');
        open_modale();
        $('#menu_name').val(localStorage.getItem(username));
    });

}

function is_ready() {
    username = $('.userInfo > a').text();
    account_configuration = JSON.parse(localStorage.getItem(username));
    if(account_configuration === null) {
        account_configuration = {};
    }
    add_menu();
    generate_modale();
}


$(document).ready(function() {
    is_ready();
});