(function ($) {

	$(function() {
		$('#search').focus();
		count = 0;

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
		}

		$('#search').keypress(function(e){
      		if(e.which == 13) {
       			add();
				return false;
      		}
      	});
		$('#add').click(function(){
			add();
		});
	});

	$(function() {
		$('#list').on('dblclick', 'li', function(){
			var id_a_suppr = $(this).attr('id');
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});
	});

	$(function() {
		$('ul').sortable({
 			cursor: "move"
		});
	});

})(jQuery);