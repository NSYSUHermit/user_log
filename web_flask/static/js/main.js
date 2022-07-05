function updateTable() {
	var newitem = function(){
    var item = $('<div>')
        .addClass('item')
        .css('display','none')
        .text('This is a brand new item')
        .prependTo('#scroller')
        .slideDown();
    $('#scroller .item:last').animate({height:'0px'},function(){
        $(this).remove();
    });
	}
	setInterval(newitem, 2000);
}
