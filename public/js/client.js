var baseUrl = location.origin;

function ajaxRequest(url, method, data, callback) {
    $.ajax({
        url: url,
        type: method,
        data: data,
        success: function(data, textStatus, request) {
            callback(null, data);
        },
        error: function(e) {
            callback(e);
        }
    });   
}
//brusbilis code from github
  function checkImages () {
    var array = document.getElementsByClassName('mainImage');
    for (let i = 0; i < array.length; i++) {
      urlPicExists(array[i]);
    }
  }

  function urlPicExists (pic) {
    // console.log('testing ...', pic.src)
    var imageData = new Image();
    imageData.onload = function () {};
    imageData.onerror = function () {
      pic.src = baseUrl + '/img/noimage.png';
    // if (user) { pic.src = baseUrl + './../images/photoNot.png'; }
    };
    imageData.src = pic.src;
  }
//brusbilis code from github

$(document).ready(function(){

    var $grid = $('.grid').imagesLoaded( function() {
        $grid.masonry({
            itemSelector: '.grid-item',
            isFitWidth: true,
            gutter:10
        }); 
    });
checkImages ();

//$('.imageHolder img').brokenImage({replacement: '/img/noimage.png',timeout: 1000});


    $( document.body).on('click','.delete', function(e) {
        e.preventDefault();
        let id = $( this ).attr('id');
        let data = { id:id };
        //console.log(id);
        ajaxRequest(`${baseUrl}/userLogged/deleteImage`, 'DELETE', data, function(err, data) {
            if (!err) {
                $grid.masonry( 'remove', $(`[name=${id}]`))
                    // trigger layout
                    .masonry('layout');
            } else {
                alert("Something went wrong!");
            }
        });
    });

     $( document.body).on('click','.like', function(e) {
         e.preventDefault();
        let id = jQuery( this ).data('id');
        let voted = jQuery( this ).data('voted');
        let likes = $( this ).children().eq(1).text();
        let data = {id, voted}
        let that = jQuery( this );
        if (voted === "shouldLogIn") { return alert("You need to log in to use that function!"); }
        ajaxRequest(`${baseUrl}/userLogged/like`, 'PATCH', data, function(err, data) {
            if (!err) {
              if (voted === "yes") {
                  jQuery( that ).data('voted', 'no');
                  console.log(jQuery( that ).data('voted'));
                  likes--;
                  $( that ).children().eq(1).text(likes)
              }else {
                  jQuery( that ).data('voted', 'yes');
                  likes++;
                  $( that ).children().eq(1).text(likes)                  
              }

            } else {
                alert("Something went wrong!");
            }
        });
    });   

     $('#addImage').on('submit',function(e){
        e.preventDefault();
        $('#addModal').modal('hide'); 
        let title = jQuery('#title').val();   
        let link = jQuery('#link').val(); 
        let data ={ title:title, link:link };
        ajaxRequest(`${baseUrl}/userLogged/newImage`, 'POST', data, function(err, data) {
             if (!err) {
                let html = `<div class="grid-item" name=${data._id} >`;
                html += `<div class="imageHolder">`;
                html += `<img src=${data.link} alt=${data.title}>`;
                html += `<p>${data.title}</p>`;
                html += `</div>`;
                html += `<div class="data">`;
                html += `<a href="/${data.owner}" ><img id="profile" src=${data.profileLink} alt=${data.owner}></a>`;
                html += `<i id=${data._id} class="fa fa-times delete" aria-hidden="true" ></i>`;
                html += `<div data-id=${data._id} data-voted=${data.voted} class="like btn btn-default btn-sm" >`
                html += `<span><i class="fa fa-thumbs-up" aria-hidden="true"></i></span>`
                html += `<span>${data.likes}</span>`
                html += `</div>`;
                html += `</div>`;
                html += `</div>`;
                var elem = $(html);

                $grid.append(elem);
                $grid.masonry( 'appended', elem )
                    .masonry('layout');
      
            } else {
                 alert("Please provide a valid title or specify the author!");
            }
        });
    });
});

























