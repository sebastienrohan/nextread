(function ($) {

	// init
	$('#search').focus();
	$('ul').sortable({
		cursor: "move"
	});
	
	// load booklist from sessionStorage
	var book_list_json = sessionStorage.getItem('booklist');
	var book_list = JSON.parse(book_list_json);
	if (book_list != null) {

		// retrieve count
		var count = sessionStorage.getItem('count');

		// populate ul #list with stored booklist
		var retrieved_list = '';
		for (var key in book_list) {
			retrieved_list += '<li id=\"' + key + '\">' + book_list[key] + '</li>';
		}
		$('#list').html(retrieved_list);
	}
	else {

		// create intial vars
		var count = -1;
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
			sessionStorage.setItem('count', count);
			book_list[count] = title;
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
			var id_to_del = parseInt($(this).attr('id'));
			$(this).fadeOut(function(){
				
				// update list order numbers in the HTML
				$('li').each(function(index){
					if (index > id_to_del) {
						var new_id = index;
						new_id--;
						this.id = new_id;
					}
				});

				$(this).remove();
				count--;
			});
			
			// delete from sessionStorage
			var book_to_del = String(id_to_del);
			delete book_list[book_to_del];

			// update list order numbers in the stored object's properties
			$.each(book_list, function(key, value){
				if (key > id_to_del) {
					var new_key = parseInt(key);
					new_key--;
					book_list[new_key] = book_list[key];
					delete book_list[key];
				}
			});

			// write to sessionStorage
			var book_list_json = JSON.stringify(book_list);
			sessionStorage.setItem('booklist',book_list_json);


		});
		$('#list').on('doubletap', 'li', function(){
			var id_to_del = $(this).attr('id');
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});
	});

})(jQuery);