(function ($) {



	// INIT
	$('#search').focus();
	
	// load booklist from sessionStorage
	var book_list_json = sessionStorage.getItem('booklist');
	var book_list = JSON.parse(book_list_json);
	if (book_list != null) {
		// retrieve count
		var count = sessionStorage.getItem('count');

		// populate ul #list with stored booklist
		var retrieved_list = '';
		for (var key in book_list) {
			var regen_book = '<li id=\'' + count + '\'>' + book_list[key].title + '<a href=\'' + book_list[key].link  + '\' target=\'_blank\'><div class=\'pull-right\'>' + book_list[key].rating + ' % <img src=\'' + book_list[key].icon + '\'></div></a></li>';
			retrieved_list += regen_book;
		}
		$('#list').html(retrieved_list);
	}
	else {
		// create intial vars
		var count = -1;
		var book_list = {};
	}

	// micro-plugin to retrieve only text in a node
	$.fn.textOnly = function(){
	  return this.clone().children().remove().end().text();
	};

	// listen for book movement
	$('ul').sortable({
		cursor: 'move',
		stop: function(event, ui){	
	        // update list order numbers in the HTML & sessionStorage
	        var book_nbr = $('li').length;
	        $('li').each(function(index){

	        	var book_li = this;
	        	book_title = $(book_li).textOnly();
	        	book_rating = parseInt($(book_li).children().text());
	        	book_link = $('a', book_li).attr('href');
	        	book_icon = $('img', book_li).attr('src');

	        	if (index < book_nbr) {
	        		// HTML
	        		this.id = index;
	        		// sessionStorage
	        		book_list[index].title = book_title;
	        		book_list[index].rating = book_rating;
	        		book_list[index].link = book_link;
	        		book_list[index].icon = book_icon;
	        	}
	        });
	        var book_list_json = JSON.stringify(book_list);
			sessionStorage.setItem('booklist',book_list_json);
        }
	});

	// listen for deleteBook()
	$('#list').on('dblclick', 'li', function(){
		var self = this;
		deleteBook(self);
	});
	// listen for deleteBook() on mobile
	$('#list').on('doubletap', 'li', function(){
		var self = this;
		deleteBook(self);
	});


	// ADD BOOK
	$(function() {

		function add(){
			var api_key = '6ad6214b9afeca197fbea7b1d6d52758b463689f';
			var title = $('#search').val();

			function addBook(link, rating, icon){
				var book = $('<li id=\'' + count + '\'>' + title + '<a href=\'' + link  + '\' target=\'_blank\'><div class=\'pull-right\'>' + rating + ' % <img src=\'' + icon + '\'></div></a></li>');
				if (title.length > 40) {
					book.addClass('small');
				}
				book.hide();
				$('#list').append(book);
				book.fadeIn();
				$('#search').val('').focus();
				
				// sessionStorage
				sessionStorage.setItem('count', count);
				var new_book = {};
				new_book.title = title;
				new_book.rating = rating;
				new_book.link = link;
				new_book.icon = icon;
				book_list[count] = new_book;
				var book_list_json = JSON.stringify(book_list);
				sessionStorage.setItem('booklist',book_list_json);
			}

			if (title.length != 0) {
				count++;
				
				// API call to idreambooks
				$.ajax({
					url: 'http://idreambooks.com/api/books/reviews.json?q=' + title + '&key=' + api_key,
					dataType: 'json',
					success: function(json){
						if (json.book.rating != undefined) {
							var icon = json.book.to_read_or_not;
							var link = json.book.detail_link;
							var rating = json.book.rating;
						}
						else {
							var rating = '?';
						}
						addBook(link,rating, icon);
						},
					error: function(json){
						var rating = '?';
						addBook(link,rating, icon);
					}
				});
			}
			else {
				$('#search').focus();
				return false;
			}
		}

		// press Enter
		$('#search').keypress(function(e){
      		if(e.which == 13) {
       			add();
				e.preventDefault();
      		}
      	});

      	// click the + button
		$('#add').click(function(){
			add();
		});
	});


	// DELETE BOOK
	function deleteBook(book_suppr) {
		var id_to_del = parseInt($(book_suppr).attr('id'));
		$(book_suppr).fadeOut(function(){
			
			// update list order numbers in the HTML
			$('li').each(function(index){
				if (index > id_to_del) {
					var new_id = index;
					new_id--;
					this.id = new_id;
				}
			});

			$(book_suppr).remove();
			count--;
			sessionStorage.setItem('count', count);
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
		sessionStorage.setItem('count', count);
	}

})(jQuery);