function page_execute() {

    $('.small-block-button').each(function() {
        if($(this).text() == 'Clean up') {
            var s_link = $(this).clone();
            $(this).hide();
            s_link.attr('href', 'https://google.com');
            s_link.click(function() {
                return confirm('Are you sure ?');
            });
            $(this).parent().append(s_link);
        }
    });
};


$(document).ready(function() {
    page_execute();
});