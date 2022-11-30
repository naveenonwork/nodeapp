jQuery( document ).ready(function() {

    setupPrevSearch=function(){
       sw= jQuery(this).attr('data-search')
       url='/search/'+sw;
       if(sw!=''){
           jQuery.post(url, function( response ) {
                jQuery( ".search-placeholder" ).html( response );
                jQuery( ".search-placeholder" ).find('.search-btn').on("click",setupSearch)
                jQuery( ".search-placeholder" ).find('.search-cities').find('button').on("click",setupPrevSearch)
         }); 
       }
    }
    setupSearch=function(){
        sw = jQuery('.search-input').val()
        url='/search/'+sw;
        if(sw!=''){
            jQuery.post(url, function( response ) {
                 jQuery( ".search-placeholder" ).html( response );
                 
                 jQuery( ".search-placeholder" ).find('.search-btn').on("click",setupSearch)
                 jQuery( ".search-placeholder" ).find('.search-cities').find('button').on("click",setupPrevSearch)
          }); 
        }
    }
    jQuery('.search-btn').on("click",setupSearch)
    jQuery('.search-cities').find('button').on("click",setupPrevSearch)
});