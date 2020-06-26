
// Set values to cookies.
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/ ';
    javascript:window.location.reload();
}


// Get value from cookies.
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}


jQuery(document).ready(function(){

	

	var dict = {
		'Англиски':'ZEPvhoeH1gA',
'Подесувања за форумот':'oMdrNsM7ar0',
'Тип на известување по е-пошта':'LM4YIKf-xE0',
'Автоматско пријавување на форум':'xhAb6yOjLWc',
'Следење на форум':'qocybMO9XFE',
'Откако ќе се испратат пораки на форумот':'t4HRbkuXQgA',
'Подесувања за пораките':'VDuGoHQ6Rhs',
'Можете да забраните кој да ви праќа порака':'IPb7AKlURuE',
'Само моите контакти':'4pywjo99frs',
'Моите контакти и секој запишан на мојот курс':'P-8xPk-H8Lk',
'Некои курсеви можат да дозволуваат пристап како гостин':'HuDFfHiZV6Q',
'Преференци за известувања':'uswSiG9-i4I',
'Привремено оневозможи ги известувањата':'ifAotAfFLcI',
'Скокачки известувања':'xLYZW16yQuU',
'Е-пошта':'bfF3XERkRfI',
'Онлајн':'3II3uln1aO0',
'Офлајн':'CrY5Oz2xEv0',
'Задача':'BBoEbwLp51E',
'Известувања за задачи':'5CGP2ov-lIE',
'Фидбек':'c65g6jpml14',
'Известувања за фидбек':'6j63-nW3c8k',
'Најавете се како гостин':'hB_1UCbC_5g',
'Потсетник за фидбек':'M1bxJ59-LN4',
'Форум':'iwwz7wK2bmg',
'Претплатени објави на форум':'wrQNUyIgsO4',
'Претплатени објаснувања за форум':'LSpL-w22ncA',
'Лекција':'CL0fL9eafzA',
'Известувања за оценувани есеи':'bHKfcHVRnj8',
'Систем':'Qo2FscNrDG4',
'Известувања за потврда на барања за креирање курсеви':'_V-HCdv7Hdw',
'Известувања за одбивање на барања за креирање курсеви':'u8-wynCBr2c',
'Известувања за примање на значки':'kWnolCI78zU',
'Известувања':'DxNopiwpTGM',
'Коментар објавен на план за учење':'ANGWcJm1hqM',
'Коментарот објавен на надлежност':'ammFuKqG3w8',
'Известување за побарувања на пораки од контакт':'Mo9obQ3tBuQ',
'Мануелни запишувања':'IFJvWqrAL1s',
'Известувања за истекување на мануелни запишувања':'8Jso8ASpQpQ',
'Само-запишување':'msM6LqpLMrw',
'Известувања за истек на само-запишувања':'DzysiXUQOek',
'Приватност на податоци':'w3RNGA70-9A',
'Барање за процесирање на резултатите':'-fNE78oiuaQ',
'Конфигурација на дојдовни пораки':'joODAJH8hk8',
'Немате нови известувања':'mqdPTLEyLF0',
'Порака да се одобри дека порака е испратена од вас':'pamqUyJGEYA',
'Предупредување дека испратената порака не може да се процесира':'c-wKvtDSxaY',
'Потврда дека пораката е успешно процесирана':'M19UP49Mwt4',
'Кориснички детали':'CDd4Fn8FV_s',
'Уредете профил':'INKeyd4HfUc',
'Адреса за е-пошта':'6Ms83aR5CXY',
'Внес во блог':'tTQ8ccrYCPw',
'Додади нов запис':'y9S6kmLE3LI',
'Пораки на форумот':'UgebBuTa-RI',
'Нема пораки':'zyHQ0s8qP5Q',
'Барај':'7WQjMoOSiHc',
'Немате направено никакви објави':'hX8VeTdDl40',
'Дискусии на форумот':'NSC8qSlJUDo',
'Сеуште не сте започнале дискусија':'a4ELHNt6tHY',
'Планови за учење':'UQAb4s-jsxM',
'Листа на планови за учење':'-lP3JBTtAGA',
'Темплејти':'7pYrmVCn3N4',
'Статус':'r2BFtRRpVeI',
'Акции':'TmxyAQASj50',
'Доказ за претходно учење':'dUv5XaSr9MQ',
'Извештаи':'CNzL_nNLoEQ',
'Поставувања':'8wtDD6KScxk',
'Мои активни сесии':'HZQDnY5W9Ag',
'Најавување':'W5K8LNmx7Cs',
'Последен пристап':'PrTsJkr7-C4',
'Последна IP адреса':'5J2RjMy4KSc',
'Преглед на оцени':'usVWkilh3o0',
'Прв пристап до сајтот':'Upckwkok8mA',
'Последен пристап до сајтот':'1lU1bEeGUSg',
'Акција':'hHIhqc33ROE',
'Оцени':'uFzFKBGxXAQ',
'Не сте запишани, ниту предавате некои предмети на овој сајт':'rZkdtghlLx8',
'Приватност':'rQfb0YITyV4',
'Пораки':'rsorFVgR2Dk',
'Контакти':'vwT5kevz3S4',
'Означен со ѕвезда':'zw28jVapTFM',
'Групни':'UvxNnkzGBSE',
'Приватни':'j8adX7yY_Os',
'Параметри':'hpPI5PoKv0Y',
'Одјавете се':'cYsDzGA_FBI',
'Можете да забраните кој да ви праќа порака':'z2-rhUiw4dw',
'Само моите контакти':'OpaUjKmi8N0',
'Моите контакти и секој запишан на мојот курс':'MK2Y9TDyVf8',
'Филозофски факултет - Скопје':'obhCxkkw-nU',
'Преференци за известувања':'kluUVlk_MI4',
'Е-пошта':'NbnEE0nuxiQ',
'Основно':'w3FPY82MtL4',
'Стисни ентер за да пратиш':'AVLP3ZNySMk',
'Моја почетна страница':'taA-EAq7RRA',
'Неодамна пристапени курсеви':'pQI38wdY-aY',
'Нема скорешни курсеви':'w6oikIPWBho',
'Преглед на курсот':'wdZn_vA3zdU',
'Сите курсеви':'x2hHVEuEOis',
'Прикажи курсеви во прогрес':'oY5skwCgPZ4',
'Не сте најавени':'a-Tv5GrZmBs',
'Прикажи идни курсеви':'zyDLfc4Hphs',
'Прикажи изминати курсеви':'QEqlHm_bnNo',
'Прикажани':'Upnd-L6_LkM',
'Скриени':'IYzG--PyCCc',
'Мои приватни датотеки':'bBD8YpszkCQ',
'Нема датотеки на располагање':'hWvx5EQusuw',
'Менаџирај ги моите приватни датотеки':'N1Wz4v6uZyM',
'Додади се':'YaQSWC_QGaw',
'Креирај фолдер':'bnR-sbqjYGg',
'Преземи се':'YsZsyZgR-EQ',
'Најавете се':'nN1EEsghdjo',
'Прикажи фолдер со икони на датотеки':'bWJz6E9_e4g',
'Прикажи фолдер со детали за датотеките':'_jmCX1cmG0g',
'Прикажи фолдер како дрво':'G_UjwH2S5vU',
'Можете да ги довлечете и отпуштите датотеките овде за да ги додадете':'_-klIzjbz4M',
'Зачувај ги промените':'4ojvv0Ha7Rk',
'Откажи':'EEjTOEG_0Ec',
'Онлајн корисници (последните 5 минути)':'pUwqGNonz6M',
'Календар':'gauh3n9ZPuY',
'Престојни настани':'ROJqwzs7GS0',
'Оди во календар':'npI5aXoALHM',
'Вести од страницата':'RqImHCc42FM',
'Нов настан':'qF-PWNoZFjE',
'Нема никакви настани за денес':'60DW-F5MFLE',
'Извези календар':'r8uwgJd8nhA',
'Менаџирај претплати':'bxRLe_BvTow',
'Уредување на настан':'TMyspMvurYw',
'Прикажи глобални настани':'tODUbtSC4MI',
'Сокриј категоризирани настани':'zHTQBwWyevs',
'Сокриј настани на курсот':'X2heWegFIxw',
'Сокриј настани на групата':'1pyg2GWeqes',
'Сокриј кориснички настани':'a9TIdPFI_o0',
'Македонски':'p7Bz3ei1wzA',
'Најавени сте како':'bs506TBignM',
'Одјавете се':'zMzlJSBP1Wc',
'Почнете од почеток':'RbIR3Q7O61k',
'Резиме за задржување на податоци':'5kOk4Gw32NQ',
'Сајт':'HxAmPlmPI_U',
'Цел':'c2IeBsG_IWA',
'Период на задржување':'BjxGW9D2FaY',
'Корисници':'6sIaYURijyQ',
'Цел':'gjXgMBWq5sE',
'Категории на курсот':'eVS95WUCOX0',
'Англиски':'VNVwmtMBZ18',
'Активности во рамките на курсот':'gZU_BdPzqyQ',
'Блогови':'sYfaoPhNl0M',
'Систем за е-учење на Филозофски факултет':'wT8Y3hSvshM',
'Профил':'qKySAk1jGOw',
'Врати ги основните вредности':'Oh2dzE7zsAM',
'Уреди ја оваа страница':'n3kEDGUcvZc',
'Уредете профил':'m9FXqGAd0H0',
'Основно':'MDyZaOS2sss',
'Прикажи ги сите':'qJZEMa3tstA',
'Скриј се':'uEksaYGzDhg',
'Запомни корисничко име':'i3DJgj8_6aQ',
'Адреса за е-пошта':'LVe6Qwdnj34',
'Прикажување на пораките на е-пошта':'CCv7DmQD6MQ',
'Дозволи им на другите членови во курсот да ја гледаат мојата адреса за е-пошта':'rOV0YeGNIAA',
'Сокриј ја мојата адреса за е-пошта од сите':'neW2GW7wkHs',
'Дозволи им на сите да ја гледаат мојата адреса за е-пошта':'CP6XVTGN-SU',
'Интереси':'q9mTQW687RA',
'Список на интереси':'edjoSIaGJ58',
'Внесете ги Вашите интереси одделени со запирки. Вашите интереси ќе бидат прикажани на Вашиот профил како тагови.':'zM8vLe5jKEQ',
'Опционо':'KI4VODRHaR8',
'Ажурирајте го профилот':'vsY1rt3gaF0',
'Го заборавивте корисничкото име или лозинката?':'AK5LLpeSAdk',
'Откажи':'VSzP8ptGqgs',
'Промени лозинка':'zcUQQ_a3F2k',
'Корисничко име':'SMROnOJTrrM',
'Лозинките мораат да имаат најмалку':'h8-senBdzhI',
'Сегашна лозинка':'8YHzaQT8OWc',
'Нова лозинка':'T7LmNr1sUwQ',
'Нова лозинка повторно':'60rAZxts62A',
'Пополнувањето на полињата во овој формулар обележани со ! е задолжително':'2FW3Rlvy3pU',
'Префериран јазик':'qmwbg2Kmzb4',
'Македонски':'m68M3cQ-bTE',
'Колачињата мораат да бидат овозможени во Вашиот прелистувач':'vGd_IXAxNTI'


    };
	
	
	var tmpl = '<div><div align="center "><section class="video-modal"><div class="overlay"></div><div  id="video-modal-content" class="video-modal-content"><iframe id="youtube" width="100%" height="100%" frameborder="0" allow="autoplay" allowfullscreen src=${src}></iframe><a href="#" class="close-video-modal"> <svg  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" width="100%" height="100%" frameborder="0" allow="autoplay" allowfullscreen src=${src}></iframe> <a href="#" class="close-video-modal"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve" width="24" height="24"><g id="icon-x-close"> <path fill="#ffffff" d="M30.3448276,31.4576271 C29.9059965,31.4572473 29.4852797,31.2855701 29.1751724,30.98$ <path fill="#ffffff" d="M1.65517241,31.4576271 C0.986170142,31.4570487 0.383303157,31.0606209 0.127366673,30$</g></svg></a></div></div>';
	
	var sign_language_cookie = getCookie("sign_language");
							
	var jqTmpl = jQuery;
	
	jQuery.template("modalVideoTmpl", tmpl);
	
	if (sign_language_cookie == 'true') {
		jQuery.each(dict,function(index,value){ 
		
			var findText = index;	
			var v = value;
			
			jQuery('*').filter(function() {
				return jQuery(this).children().length < 1 && jQuery(this).text().indexOf(findText) >= 0;
			}).each(function(index,item) { 
				jQuery(item).addClass("sign-language-info");
				jQuery(item).addClass("js-video-button");
				jQuery(item).attr("data-video-id",v);
				
			});
			

		});
		toggle_video_modal();
	}

/*
	jQuery('*').mouseenter(function() {
            let key =  jQuery(this).text();
            if (key in dict) {
				jQuery(".sign-language-info").removeClass("js-video-button").removeClass("sign-language-info");
				jQuery(this).addClass("sign-language-info");
				jQuery(this).addClass("js-video-button");
				jQuery(this).attr("data-video-id",dict[key]);
				toggle_video_modal();
	               
			}
	});
	*/

	/* Toggle Video Modal
  -----------------------------------------*/
	function toggle_video_modal() {
	    
	    // Click on video thumbnail or link
	    jQuery(".js-video-button").hover(function(e){
			
			  // prevent default behavior for a-tags, button tags, etc. 
				//e.preventDefault();
				var self = this;
				
				var timer = window.setTimeout(function(){ 
					  debugger;
						// Grab the video ID from the element clicked
					  var id = jQuery(self).attr('data-video-id');

					  // Autoplay when the modal appears
					  // Note: this is intetnionally disabled on most mobile devices
					  // If critical on mobile, then some alternate method is needed
					  var autoplay = '?autoplay=1';

					  // Don't show the 'Related Videos' view when the video ends
					  var related_no = '&rel=0';

					  // String the ID and param variables together
					  var src = '//www.youtube.com/embed/'+id+autoplay+related_no;
					  
					  // Pass the YouTube video ID into the iframe template...
					  // Set the source on the iframe to match the video ID
					  //jQuery("#youtube").attr('src', src);
					  
					  var myContent = { src: src };
					  
					  jqTmpl.tmpl("modalVideoTmpl", myContent).appendTo("body");
					  
					  // Add class to the body to visually reveal the modal
					  jQuery("body").addClass("show-video-modal noscroll");
					  
				},2000);
				
				jQuery(this).mouseleave(function() {
							window.clearTimeout(timer)
				});

		});


	    // Close and Reset the Video Modal
      function close_video_modal() {
        
        event.preventDefault();

        // re-hide the video modal
        jQuery("body").removeClass("show-video-modal noscroll");
		//jQuery(".video-modal").remove();

        // reset the source attribute for the iframe template, kills the video
        jQuery("#youtube").attr('src', '');
        
      }
      // if the 'close' button/element, or the overlay are clicked 
	  jQuery('body').on('click', '.close-video-modal, .video-modal .overlay', function(event) {
	        
      // call the close and reset function
          close_video_modal();
	        
      });
      // if the ESC key is tapped
      jQuery('body').keyup(function(e) {
          // ESC key maps to keycode `27`
          if (e.keyCode == 27) { 
            
            // call the close and reset function
            close_video_modal();
            
          }
      });
	}



});

