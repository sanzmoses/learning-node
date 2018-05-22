$(document).ready(function(){

	$('.delete').click(deleteUser);
	$('.update').click(updateUser);

});

function deleteUser(){
	var confirmation = confirm('Are you sure?');
	var id = $(this).data('id');
	console.log(id);
	if(confirmation){
		
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/'+id,
			success: (res) => {
				console.log('success');
			},
			error: (res) => {
				console.log(res);
			}
		});

		window.location.replace('/');

	}
	else{
		return false;
	}
}

function updateUser(){
	console.log('fire');
	var id = $(this).data('id');
	// alert($(this).data('id'));	

	$.ajax({
		type: 'GET',
		url: '/user/'+id,
		success: function(res) {
			console.log(res);
			$('#updateModal').modal('show');
			$('.user_id').text(res.fname+' '+res.lname);
			$('#id_m').val(res._id);
			$('#fname_m').val(res.fname);
			$('#lname_m').val(res.lname);
			$('#email_m').val(res.email);
		},
		error: function(err) {
			console.log(err.statusText);
		}
	});

}