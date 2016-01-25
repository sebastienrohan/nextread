(function ($) {

	// init
	$('#search').focus();
	$('ul').sortable({
		cursor: "move"
	});
	
	// load booklist from sessionStorage
	var book_list_json = sessionStorage.getItem('booklist');
	var book_list = JSON.parse(book_list_json);

	// load var count from sessionStorage
	if (book_list != null) {
		var count = book_list['count'];
	}
	else {
		count = 0;
		var book_list = {};
	}

	// add book
	$(function() {

		function add() {
			count++;
			var title = $('#search').val();
			var book = $('<li id=\"' + count + '\">' + title + '</li>');
			if (title.length > 40) {
				book.addClass('small');
			}
			book.hide();
			$('#list').append(book);
			book.fadeIn();
			$('#search').val('').focus();
			
			// sessionStorage
			book_list['count'] = count;
			book_list['book_' + count] = title;
			var book_list_json = JSON.stringify(book_list);
			sessionStorage.setItem('booklist',book_list_json);
		}

		// press Enter
		$('#search').keypress(function(e){
      		if(e.which == 13) {
       			add();
				return false;
      		}
      	});

      	// click the + button
		$('#add').click(function(){
			add();
		});
	});

	// delete book
	$(function() {
		$('#list').on('dblclick', 'li', function(){
			var id_a_suppr = $(this).attr('id');
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});
		$('#list').on('doubletap', 'li', function(){
			var id_a_suppr = $(this).attr('id');
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});
	});

})(jQuery);