function Tracker()
{
    Tracker.prototype.initialize = function(aConstructorParams)
    {
        Tracker.INSTANCE = this;
        this.mConstructorParams = aConstructorParams;
        this.mEnvironment = aConstructorParams.environment;
        this.mPortalId = aConstructorParams.portalId;
        this.mUserId = null;
        this.mApiUrl = "";

        //Try to get a tracker idlo
        if (this.mUserId) {
            ga('create', this.mConstructorParams.trackingId, { 'userId': this.mUserId });
        } else {
            ga('create', this.mConstructorParams.trackingId, this.mConstructorParams.trackingUrl);
        }
    };

    Tracker.prototype.setUserId = function(token)
    {
        var val = this.readCookie();
        if (token) {
            if (token != val) {
                this.createCookie(token);
                val = token;
            }
        }
        if (!val) {
            this.mUserId = this.generateTrackingId();
            this.createCookie(this.mUserId);
        } else {
            this.mUserId = val;
        }
    };
    
    Tracker.prototype.generateTrackingId = function()
    {
        return this.mPortalId + new Date().getTime().toString(16) + Math.floor(Math.random()* 1000000);
    };
    
    Tracker.prototype.createCookie = function(value, days) {
        var name = Tracker.COOKIENAME;
        var date = new Date();
        days = days ? days: 365;
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
        document.cookie = name+"="+value+expires+"; path=/; domain=.gamecloudnetwork.com;";
    };

    Tracker.prototype.readCookie = function() {
        var name = Tracker.COOKIENAME;
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    Tracker.prototype.eraseCookie = function() {
        createCookie("" , -1);
    };

    Tracker.prototype.trackEvent = function(aCategory, aAction, aLabel, aCustomVars)
    {

            var aVars = {'dimension1':this.mPortalId, 'title':aCategory};

            if(this.mUserId){
                aVars.dimension5 = this.mUserId;
            }

            if(aCustomVars){
                for(var key in aCustomVars){
                    aVars[key] = aCustomVars[key];
                }
            }
            aVars["portal"] = this.mPortalId;

            if (aCategory == 'Ad') {
                aVars["ad_showed"] = aAction == "Displayed" ? 1 : 0;
                aVars["ad_size"] = aLabel.replace(",", "x").replace(" ", "").replace("[","").replace("]","");
            }

            if(Tracker.ENABLED_EVENT_CATEGORIES.hasOwnProperty(aCategory.toUpperCase())){
                this.logEvent(aCategory, aAction, aLabel, aVars);
            }

            ga('send', 'event', aCategory, aAction, aLabel, aVars);

    };

    Tracker.prototype.trackPage = function(aUrl, aTitle, aCustomVars)
    {

            var aVars = { 'page': aUrl, 'title': aTitle, 'dimension1':this.mPortalId };

            if(this.mUserId){
                aVars.dimension5 = this.mUserId;
            }

            if(aCustomVars){
                for(var key in aCustomVars){
                    aVars[key] = aCustomVars[key];
                }
            }

            ga('send', 'pageview', aVars);

    };

    Tracker.prototype.logEvent = function(aCategory, aAction, aLabel, aVars){
        

                aVars.category = aCategory;
                aVars.action = aAction;
                aVars.label = aLabel;

                var aUrl = this.mApiUrl + "log/event";

                var aXHR = $.ajax({
                    url:aUrl,
                    type:"GET",
                    dataType: 'json',
                    data:aVars
                });


    }
}
Tracker.INSTANCE;
Tracker.COOKIENAME = "gcnping";
Tracker.ACCOUNT = {
    WIDGET_FOOTER: 4,
    WIDGET_ARTICLES: 6
};

Tracker.METRIC = {
    OPEN_PORTAL: 'metric1',
    PORTAL_RENDERED: 'metric2',
    OPEN_GAME: 'metric3',
    OPEN_LEVEL: 'metric4',
    FINISH_LEVEL: 'metric5',
    PLAY_MORE_LEVELS: 'metric6',
    GAME_RENDERED: 'metric7',
    POWERUP_CONSUMED: 'metric8',
    POWERUP_PURCHASED: 'metric9',
    PLAY_INTERACTION: 'metric10',
    OPEN_LEVEL_AND_WAIT_FOR_LOADER: 'metric11',
    SHOW_ACHIEVEMENT: 'metric12',
    SHARE: 'metric13'
};

Tracker.DIMENSION = {
    PORTAL: 'dimension1',
    LEVEL: 'dimension2',
    GAME: 'dimension6',
    TRIVIA_QUESTION: 'dimension3',
    TRIVIA_ANSWER: 'dimension4',
    ACHIEVEMENT:'dimension7'
};

Tracker.ENABLED_EVENT_CATEGORIES = {
    AD:1
};


var gameslist = [];
gameslist['blackjack'] = {gameid:'game_blackjack_53da6dc4d0b8a400995665', gamename:'Triple Down Blackjack',gamelink:'triple-down-blackjack'};
gameslist['trivia'] = {gameid:'trivia_53164bec6e845068286088', gamename:'Daily News Trivia',gamelink:'daily-news-trivia'};
gameslist['ginrummy'] = {gameid:'game_ginrummy_53dbba5e5011e495582559', gamename:'Gin Rummy',gamelink:'gin-rummy'};
gameslist['bingo'] = {gameid:'game_bingo_53286e35a39d5773622111', gamename:'Vegas Bingo', gamelink:'vegas-bingo'};
gameslist['crossword'] = {gameid:'crossword', gamename:'Super Crossword', gamelink:'crossword'};
gameslist['rainbowtangle'] = {gameid:'crossword_level_53b2fdaaec6ff', gamename:'Rainbow Tangle', gamelink:'rainbow-tangle'};
gameslist['jewelking'] = {gameid:'jewelking', gamename:'Jewel King', gamelink:'jewel-king'};
gameslist['slots'] = {gameid:'slots', gamename:'Vegas Slots', gamelink:'vegas-slots'};
gameslist['picturefind'] = {gameid:'picturefind', gamename:'In The News', gamelink:'in-the-news'};
gameslist['mahjong'] = {gameid:'mahjong', gamename:'Mahjong Decades', gamelink:'mahjong'};
gameslist['speedoku'] = {gameid:'speedoku', gamename:'Speedoku', gamelink:'speedoku'};
gameslist['memory'] = {gameid:'memory', gamename:'Super Memory Match', gamelink:'super-memory-match'};


//function openGame(game_id, game_name, gamelink) {
 function openGame(gamekey) {
//gc_pathtogamesection
		 if( MobileBrowserDetect.any() == true){
			if (typeof TRACKER != "undefined") {
			  TRACKER.trackEvent('MobileGamesWidget', 'OpenGame',  gameslist[gamekey].gameid, {'dimension6':gameslist[gamekey].gameid});
			}
             url =  gc_pathtogamesection + '?gamepage=#/Game/' + gameslist[gamekey].gameid + '?mobile=1&portal=' + aPortal;
			window.location.href = url;
		 }else{
			 if (typeof TRACKER != "undefined") {
			  TRACKER.trackEvent('GamesWidget', 'OpenGame', gameslist[gamekey].gameid , {'dimension6':gameslist[gamekey].gameid });
			}
				url = gc_pathtogamesection + '?gamepage=game-page/' + gameslist[gamekey].gamelink ;
				window.location.href = url;
			 }
        return false;
      }

   
      function getQueryString(key, default_) {
        if (default_ == null) {
          default_ = ""
        }
        key = key.replace(/[[]/, "[").replace(/[]]/, "]");
        var regex = new RegExp("[?&]" + key + "=([^&#]*)");
        var qs = regex.exec(window.location.href);
        if (qs == null) {
          return default_
        } else {
          return qs[1]
        }
      }
	  
    

      var url = window.location.href;
          
      if (url.indexOf('://dev') != -1 || url.indexOf('localhost') != -1) {
        //DEV
        WORKING_ENVIRONMENT = 'Dev';
      } else if (url.indexOf('://stg') != -1) {
        //STAGE
        WORKING_ENVIRONMENT = 'Stage';
      } else if (url.indexOf('://pre') != -1 || url.indexOf('://gcn-pre') != -1) {
        //PRE-PROD
        WORKING_ENVIRONMENT = 'Pre-Prod'
      } else {
        //PROD
        WORKING_ENVIRONMENT = 'Prod';
      }

      var MobileBrowserDetect = {
        Android: function() {
          return navigator.userAgent.match(/Android/i) ? true : false
        }, BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i) ? true : false
        }, iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false
        }, iPad: function() {
          return navigator.userAgent.match(/iPad/i) ? true : false
        }, Windows: function() {
          return navigator.userAgent.match(/IEMobile/i) ? true : false
        }, Kindle: function() {
          return navigator.userAgent.match(/Kindle/i) ||
                  navigator.userAgent.match(/Silk/i) ? true : false
        }, any: function() {
          return(MobileBrowserDetect.Android() || MobileBrowserDetect.BlackBerry()
                  || MobileBrowserDetect.iOS() || MobileBrowserDetect.Windows()
                  || MobileBrowserDetect.Kindle())
        }, resolutionHigherThan: function(min_width, min_height){
          return (screen.width>=min_width) || (screen.height>=min_height);
        }
      };

      var aPortal = getQueryString('portal', 'ohiocom');
	  <!-- add in URl check -->

            var uri = document.referrer;

    var uri ="http://www.fredericknewspost.com/special/games/";

        if(uri.indexOf("platform")> -1 || uri.indexOf("portal")> -1  ){
            // check to see if platform is in another
            if(window.location.ancestorOrigins.length > 1)
            {
                uri =  window.location.ancestorOrigins[window.location.ancestorOrigins.length -1];
            }
        }
        var removehttp = uri.split("http://");
        if(removehttp.length > 1){
            var removehttps = removehttp[1].split("https://");
        }else{
            var removehttps = removehttp[0].split("https://");
        }

        if(removehttps.length > 1){
            var removewww = removehttps[1].split("www.");
        }else{
            var removewww = removehttps[0].split("www.");
        }

        if(removewww.length > 1){
            var cleanURI= removewww[1];
        }else{
            var cleanURI = removewww[0];
        }

<!-- Customize -->


         if(gc_portal != null){
             aPortal= gc_portal
         }


        TRACKER = new Tracker();
        TRACKER.initialize({environment: uri, trackingId: 'UA-53846949-1', trackingUrl: cleanURI, portalId: aPortal});
        TRACKER.trackPage('GamesWidget?portal=' + aPortal +'&url='+uri, 'GamesWidget?portal=' + aPortal);
       // TRACKER.logEvent('GamesWidget', 'view', 'view', {});