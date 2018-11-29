//<![CDATA[
function doLiveSearch( ev, keywords ) {

	if( ev.keyCode == 38 || ev.keyCode == 40 ) {
		return false;
	}	

	$('#livesearch_search_results').remove();
	updown = -1;

	if( keywords == '' || keywords.length < 3 ) {
		return false;
	}
	keywords = encodeURI(keywords);

	$.ajax({url: $('base').attr('href') + 'index.php?route=product/search/ajax&keyword=' + keywords, dataType: 'json', success: function(result) {
		if( result.length > 0 ) {
			var eList = document.createElement('ul');
			eList.id = 'livesearch_search_results';
			var eListElem;
			var eLink;

            var eLinkAll = document.createElement('a');
            eLinkAll.setAttribute("class", "livesearch_all");
            eLinkAll.appendChild( document.createTextNode('Все результаты по этому запросу') );
            eLinkAll.href = $('base').attr('href') + 'index.php?route=product/search&search=' + keywords;

			for( var i in result ) {
    			eListElem = document.createElement('li');

    	        eListDiv = document.createElement('div');
    	        //eListDiv.setAttribute("style", "height: 10px; clear: both;");
                eListDiv.setAttribute("class", "livesearch_div");

    	        eListDivpr = document.createElement("span");
    	        eListDivpr.innerHTML = result[i].price;
    	        //eListDivpr.setAttribute("style", "height: 14px; color: #147927;");
                eListDivpr.setAttribute("class", "livesearch_price");
    	        "" != result[i].special && eListDivpr.setAttribute("style", "text-decoration: line-through;");

    	        eListDivprspec = document.createElement("span");
    	        eListDivprspec.innerHTML = result[i].special;
    	        //eListDivprspec.setAttribute("style", "font-weight: bold; margin-left: 8px; color: #a70d0d; font-size: 16px;");
                eListDivprspec.setAttribute("class", "livesearch_special");

    	        eListDivstatus = document.createElement("span");
    	        eListDivstatus.innerHTML = result[i].stock;
    	        //eListDivstatus.setAttribute("style", "height: 14px; color: #337ab7; margin-left: 15px;");
                eListDivstatus.setAttribute("class", "livesearch_stock");

    	        eListImg = document.createElement('img');
    	        eListImg.src = result[i].image;
    	        //eListImg.setAttribute("style", "margin-right: 10px;");
                eListImg.setAttribute("class", "livesearch_img");
    	        eListImg.align = 'left';

    	        eLink = document.createElement('a');
    	        //eLink.setAttribute("style", "display: block;");
    			eLink.appendChild( document.createTextNode(result[i].name) );

    			if( typeof(result[i].href) != 'undefined' ) {
    			    var convertlink = result[i].href;
    			    eLink.href = convertlink.replace(/&amp;/g, "&");
    			} else {
    			    eLink.href = $('base').attr('href') + 'index.php?route=product/product&product_id=' + result[i].product_id + '&keyword=' + keywords;
    			}

                eListElem.appendChild(eListImg);
                eListElem.appendChild(eLink);
                eListElem.appendChild(eListDivpr);
                "" != result[i].special && eListElem.appendChild(eListDivprspec);
                //eListElem.appendChild(eListDivstatus);
                eListElem.appendChild(eListDiv);

                eList.appendChild(eListElem);
			}

            eList.appendChild(eLinkAll);

			if( $('#msearchresults').length > 0 ) {
			    $('#msearchresults').remove();
			}

            $('#search').append(eList);
		}
	}});

	return true;
}

function upDownEvent( ev ) {
	var elem = document.getElementById('livesearch_search_results');
	var fkey = $('#search').find('[name=search]').first();

	if( elem ) {
		var length = elem.childNodes.length - 1;

		if( updown != -1 && typeof(elem.childNodes[updown]) != 'undefined' ) {
			$(elem.childNodes[updown]).removeClass('highlighted');
		}

		// Up
		if( ev.keyCode == 38 ) {
			updown = ( updown > 0 ) ? --updown : updown;
		}
		else if( ev.keyCode == 40 ) {
			updown = ( updown < length ) ? ++updown : updown;
		}

		if( updown >= 0 && updown <= length ) {
			$(elem.childNodes[updown]).addClass('highlighted');

			var text = elem.childNodes[updown].childNodes[0].text;
			if( typeof(text) == 'undefined' ) {
				text = elem.childNodes[updown].childNodes[0].innerText;
			}

			$('#search').find('[name=search]').first().val( new String(text).replace(/(\s\(.*?\))$/, '') );
		}
	}

	return false;
}

var updown = -1;

$(document).ready(function(){
	$('#search').find('[name=search]').first().keyup(function(ev){
		doLiveSearch(ev, this.value);
	}).focus(function(ev){
		doLiveSearch(ev, this.value);
	}).keydown(function(ev){
		upDownEvent( ev );
	}).blur(function(){
		window.setTimeout("$('#livesearch_search_results').remove();updown=0;", 150000);
	});
	$(document).bind('keydown', function(ev) {
		try {
			if( ev.keyCode == 13 && $('.highlighted').length > 0 ) {
				document.location.href = $('.highlighted').find('a').first().attr('href');
			}
		}
		catch(e) {}
	});
	
	
});
//]]>
