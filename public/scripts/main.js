$(document).ready(function(){
  
  function clearSearch() {
    $('#contentOutput').empty();
    $('#savedSearches').empty();
  }
  
  //toggle search icon and input field
    $('.fa').on('click', function() {
      $('.fa').toggle(300, function() {
        $('#input').toggle(500, function() {
          $('#input').focus();
        })
       })
    })

  //do stuff on hover
  $(document).on('mouseenter', 'li', function() {
    $( this ).css({
          backgroundColor:'black'
        })
       $( this ).find('a').animate({
         'font-size':'1.6em',  
       }, 100)
  })
  
  $(document).on('mouseleave', 'li', function() {
    $( this ).find('a').animate({
          'font-size':'1.5em'
        }, 100)
        $( this ).css({
          backgroundColor:'rgba(9, 9, 9, .9)'
        })
  })
  //end of 'do stuff on hover'
  
  //object that handles displaying saved searches
  var saved = {
    search: [],
    loadSaved: function() {
      var recnt = "<li class='itemDisplay'>Recent searches</li>";
      for (x=0; x<this.search.length; x++) {
  $('#savedSearches').prepend(saved.search[x][0]);
    }
      
      $('#savedSearches .itemDisplay').toggle(500);
      $('#savedSearches').prepend(recnt);
      
    }//end of loadsaved
  }; //end 'saved' Object
  //initiate saved search
  $('#recentBtn').on('click', function(){
    $('#savedSearches').empty();
    saved.loadSaved()
  })
  
 //MAIN SEARCH STUFF
  var search = {
    initiate: function() {
      $('#contentOutput').empty();
      this.ajaxRequest()
    },
    
    getSearch: function() {
      var q = $("#input").val()
      $("#input").val("");//empties search input after request
      return q
    },//end search input
    
    ajaxRequest: function() {
    $.ajax( {
    url: 'https://en.wikipedia.org/w/api.php',
    data: {
      action: 'query',
      format: 'json',
      prop: 'info|pageimages|extracts',
      exintro: 1,
      explaintext: 1,
      exsentences: 1,
      exlimit: 'max',
      pilimit: 'max',
      generator: 'search',
      gsrsearch: search.getSearch(),
      gsrlimit: 10,     
      inprop: 'url',
      piprop: 'thumbnail|name|original', 
      redirects: 1,
          },
    dataType: 'jsonp',
    type: 'POST',
    async: false,  
    headers: { 'Api-User-Agent': 'Example/1.0' },
    success:  function(data) {
      if (!data.query) {
        alert("Please check your spelling and try again")     
      };
    var result = data.query.pages;
      search.displayResults(result);
    },
      error: function(err) {
        alert(err);
      }
    })//end of ajax
    },//end of ajax request function
    
    displayResults: function(result) {
      var indexPoints = [];
      var s = saved.search;
      var html = "";
      var entry = [];
      var key = Object.keys(result);
      
      for (x=0; x<key.length; x++) {
          indexPoints.push(result[key[x]]);
        };           
      for (x=0; x<indexPoints.length; x++) {
        var url = indexPoints[x].fullurl;
        var extract = indexPoints[x].extract;
        var pageImage = indexPoints[x].pageimage;
        var title = indexPoints[x].title;
        var thumbnail;
        var image;
        //deal with missing thumbnails
        if (!indexPoints[x].thumbnail) {          
           image = "<p>no image for <strong style='font-size:1.3em'>'" + title + "'</strong></p>";
        } else {
        thumbnail = indexPoints[x].thumbnail.source;
         image = "<img src='" + thumbnail + "' alt='image for'" + title + "' class='thumbnail' style='margin:0;'>";
        };
        //create li's
        html +="<li class='itemDisplay' style='display:none'>";
        html += "<a class='title' href='" + url + "' target='_blank'>" + title + "</a>";
        html +=  image;
        html += "<p style='margin-bottom:0;'>" + extract + "</p></li>";
        entry.push(html);//prep for saved search
        };   
      s.push(entry);//store for saved search 
      //end of "each" parse function

      $('.mainOutput').hide();
      $('#contentOutput').html(html)
      $('#contentOutput li:eq(0)').toggle();
      createBtn();
      $('.mainOutput').fadeIn(500);
      
      //create MORE button and expand search      
  function createBtn() {
    var btn;
    btn = "<button type='button' class='btn btn-default btn-xs getMore'>more!</button>";
    $('.getMore').remove();
    $('.mainOutput').append(btn);
    $('.getMore').bind('click', function() {
      $('.getMore').remove();
      $('#contentOutput li:gt(0)').slideToggle(500)
  });
    
 }  
    }//display results
  };//end of search Object
  
  $('#srchBtn').on('click', function() {
    clearSearch();
    if ($('input').val() == false) {
      alert("Can't think of what to search for? Try the random button!");   
      } else {
     search.initiate();
      };
  });
  $('input').on('keypress', function(event) {
    if (event.which === 13)
    $('#srchBtn').click();
  })  
})