
function generate_filter() {
    var requestFilter = [];
    $('#filtersList tr[id^=filer_]').each(function() {
        var cond = "";
        var ff = $(this).find('select[id^=ff]').val();
        var fo = $(this).find('select[id^=fo]').val();
        var fv = $(this).find('*[id^=fv]').val();
        var fv_date = $(this).find('*[id^=fv][id$=date]').val();
        var fv_date_b = $(this).find('*[id^=fv][id$=date_b]').val();
        var fieldType = $(this).find('*[id^=fieldType]').val();
    //    console.log('ff: '+ff+' - '+'fo: '+fo+' - '+'fv: '+fv+' - '+'fv_date: '+fv_date+' - '+'fv_date_b: '+fv_date_b);
        if(ff != '') {
            cond = ff;
            switch(fo) {
                case 'eq':
                    cond += " = ";
                    break;
                case 'lt':
                    cond += " < ";
                    break;
                case 'gt':
                    cond += " > ";
                    break;
                case 'neq':
                    cond += " != ";
                    break;
                case 'lte':
                    cond += " <= ";
                    break;
                case 'gte':
                    cond += " >= ";
                    break;
                case 'lk':
                    cond += " LIKE ";
                    break;
                case 'nl':
                    cond += " is null";
                    break;
                case 'nnl':
                    cond += " is not null";
                    break;
                case 'between':
                    cond += " >= '" + fv_date + "' and " + ff + " < '" + fv_date_b + "'";
                    break;
                default:
                    cond = "";
            }
            var need_quote = fieldType != 'decimal' && fieldType != 'integer';
            if(cond != '' && fo != 'between' && fo != 'nl' && fo != 'nnl') {
                cond += (need_quote ? "'" : "") + fv + fv_date + (need_quote ? "'" : "");
            }
            requestFilter.push(cond);
        }
    });
    console.log(requestFilter.join(' and '));
    $('#filter_zoql').text(requestFilter.join(' and '));
}



function page_execute() {
    $('#id_expand_Content li').each(function(){
        var e = $(this);
        var apiname = e.find('input').val();
        var fieldname = e.find('label').text().trim();
        if(apiname != null) {
            e.attr('apiname',apiname);
            e.attr('fieldname',fieldname);
            e.attr('title',apiname);
            e.find('label').text(fieldname);
            e.find('input').attr('id','input-'+apiname.replace(/\./g,'-'));
            e.find('label').attr('for','input-'+apiname.replace(/\./g,'-'));
        }
    });
    $('#div_selected_ds').append($('<textarea id="select_zoql" rows="5" style="width:100%"></textarea>'));
    $('#div_selected_ds').append($('<button id="refresh_selected">Refresh</button>'));
    $('#refresh_selected').click(function(event) {
        event.preventDefault();
        var to_select = $('#select_zoql').val().replace(/\s/g,'').split(',');
        $('#id_expand_Content li input:checked').each(function(){
            $(this).attr("checked",false);
        });
        $.each(to_select, function(k,v) {
            $('#input-'+v.replace(/\./g,'-')).attr("checked",true);
        });
        $('#id_expand_Content table[id!=id_all_table]').each(function() {
            window.updateCheckCount($(this).attr('id'));
        });
        $('#select_zoql').text(to_select.join(', '));
    });
    $('#div_selected_ds').show();
    var selectedField = [];
    $('#id_expand_Content li input[type=checkbox]').change(function() {
        selectedField = [];
        $('#id_expand_Content li input:checked').each(function(){
            selectedField.push($(this).val());
        });
        $('#select_zoql').val(selectedField.join(', '));
        return false;
    });
    $('#id_expand').append($('<a href="#" style="float:right" id="toggleapiname" alt="fieldname">Toggle API Name</a>'));
    $('#toggleapiname').click(function() {
        var tmp = $(this).attr('alt');
        $(this).attr('alt',(tmp == 'apiname' ? 'fieldname' : 'apiname'));
        $('#id_expand_Content li').each(function(){ 
            var e = $(this);
            var apiname = e.attr('apiname');
            var fieldname = e.attr('fieldname');
            if(tmp == 'apiname') {
                e.attr('title',apiname);
                e.find('label').text(fieldname);
            }
            else {
                e.attr('title',fieldname);
                e.find('label').text(apiname);
            }
        });
        return false;
    });
    $('#filtersList').append($('<textarea id="filter_zoql" rows="5" style="width:100%"></textarea>'));
    $('#filtersList').append($('<button id="generate_filter">generate</button>'));
    $('#generate_filter').click(function(event) {
        event.preventDefault();
        generate_filter();
    });
};


$(document).ready(function() {
    page_execute();
});