
function generate_filter() {
    var requestFilter = [];
    jQuery('#filtersList tr[id^=filer_]').each(function() {
        var cond = "";
        var ff = jQuery(this).find('select[id^=ff]').val();
        var fo = jQuery(this).find('select[id^=fo]').val();
        var fv = jQuery(this).find('*[id^=fv]').val();
        var fv_date = jQuery(this).find('*[id^=fv][id$=date]').val();
        var fv_date_b = jQuery(this).find('*[id^=fv][id$=date_b]').val();
        var fieldType = jQuery(this).find('*[id^=fieldType]').val();
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
    jQuery('#filter_zoql').text(requestFilter.join(' and '));
}



function page_execute() {
    jQuery('#id_expand_Content li').each(function(){
        var e = jQuery(this);
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
    jQuery('#div_selected_ds').append(jQuery('<textarea id="select_zoql" rows="5" style="width:100%"></textarea>'));
    jQuery('#div_selected_ds').append(jQuery('<button id="refresh_selected">Refresh</button>'));
    jQuery('#refresh_selected').click(function(event) {
        event.preventDefault();
        var to_select = jQuery('#select_zoql').val().replace(/\s/g,'').split(',');
        jQuery('#id_expand_Content li input:checked').each(function(){
            jQuery(this).attr("checked",false);
        });
        jQuery.each(to_select, function(k,v) {
            jQuery('#input-'+v.replace(/\./g,'-')).attr("checked",true);
        });
        jQuery('#id_expand_Content table[id!=id_all_table]').each(function() {
            updateCheckCount(jQuery(this).attr('id'));
        });
        jQuery('#select_zoql').text(to_select.join(', '));
    });
    jQuery('#div_selected_ds').show();
    var selectedField = [];
    jQuery('#id_expand_Content li input[type=checkbox]').change(function() {
        selectedField = [];
        jQuery('#id_expand_Content li input:checked').each(function(){
            selectedField.push(jQuery(this).val());
        });
        jQuery('#select_zoql').val(selectedField.join(', '));
        return false;
    });
    jQuery('#id_expand').append(jQuery('<a href="#" style="float:right" id="toggleapiname" alt="fieldname">Toggle API Name</a>'));
    jQuery('#toggleapiname').click(function() {
        var tmp = jQuery(this).attr('alt');
        jQuery(this).attr('alt',(tmp == 'apiname' ? 'fieldname' : 'apiname'));
        jQuery('#id_expand_Content li').each(function(){ 
            var e = jQuery(this);
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
    jQuery('#filtersList').append(jQuery('<textarea id="filter_zoql" rows="5" style="width:100%"></textarea>'));
    jQuery('#filtersList').append(jQuery('<button id="generate_filter">generate</button>'));
    jQuery('#generate_filter').click(function(event) {
        event.preventDefault();
        generate_filter();
    });
};


jQuery(document).ready(function() {
    page_execute();
});