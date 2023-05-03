//click Header table
function click_header(){
    $(document).ready(function(){
        $('tr.header').click(function(){
            $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
            $(this).nextUntil('tr.header').slideToggle(100);
        }).click(); // fake click event!
    });
}