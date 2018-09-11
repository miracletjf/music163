{
  let view = {
    el: '#songPage',
    template: `
    <div class="song-box" data-song-id="{{id}}">
      <h3>{{name}}</h3>
      <p>{{author}}</p>
      <audio src="{{url}}" controls="">
        Your browser does not support the <code>audio</code> element.
      </audio> 
      <button id="play">播放</button>
      <button id="pause">暂停</button>
    </div>`,
    init(){
      this.$el = $(this.el);
      this.audio = this.$el.find('audio')[0];
      this.$songContent = this.$el.find('#songContent');
      this.$name = this.$el.find('#songName');
      this.$author = this.$el.find('#songAuthor');
      this.$bgBox = this.$el.find('#bgBox');
      this.$lyric = this.$el.find('#lyric');
      this.$img = this.$el.find('#songImg');
    },
    render(data){
      let song = data.song;
      this.$name.text(song.name);
      this.$author.text(song.author);
      this.audio.src = song.url;
      this.$img[0].src = song.imgUrl;
      this.$bgBox.css({'background-image':`url('${song.imgUrl}')`});
      window.eventHub.emit('startPlay');
      
    },
    play(){
      this.audio.play();
    },
    pause(){
      this.audio.pause();
    },
    renderLyric(lyric){
      console.log(lyric);
      let lyricHtml = '';
      let lyricObj = {};
      let strArr = lyric.split('\n').map((item,index)=>{
        // [00:00.00] xxxxx -> [00:00.00 , xxxxx
        let lyricLineArr = item.split(']');
        // [00:00.00 , xxxxx - > [00:00.00 return xxxxx
        let lyricText = lyricLineArr.pop();
        // [00:00.00, [00:11.00 ... -> 0,11
        let timeArr = lyricLineArr.map(timeItem=>{
          // [00:00.00 -> 00,00.00
          let timeItemArr =  timeItem.substring(1).split(':');
          //00,00.00 -> 0
          let timeKey = (timeItemArr[0]*60 - -timeItemArr[1]).toFixed(2);

          lyricObj[timeKey] = index;

          return timeKey;
        })

        lyricHtml += `<p lyric="${index}">${lyricText}</p>`;
        return lyricText;
      })

      this.$lyric.html(lyricHtml);

      return lyricObj;
    },
    showLyric(index){
      let $nowLyric = this.$lyric.find(`[lyric="${index}"]`);
      let lineHeight = $nowLyric.outerHeight();
      $nowLyric.addClass('active').siblings().removeClass('active');
      this.$lyric.css({'transform': `translateY(-${ (index - 1) * lineHeight}px)`})
    }

  }

  let model = {
    data:{
      status: 'ready'
    },
    setId(id){
      this.data.id = id; 
    },
    fetch(){
      let songId = this.data.id;
      let query = new AV.Query('Song');
      return query.get(songId).then(song =>{
        this.data.song = {id: song.id,...song.attributes};
      }, function (error) {
        console.log('获取数据失败！');
      });
    }
  }

  let controller = {
    init(view,model){
      this.model = model;
      this.view = view;
      this.view.init();
      this.getSongId();
      this.bindEvents();
      this.bindEventHubs();
      this.getSong();
    },
    bindEvents(){

      this.view.$songContent.on('touchstart',e=>{
        if(this.model.data.status === 'playing'){
          window.eventHub.emit('pause');
        }else {
          window.eventHub.emit('play');
        }
      })
      $(this.view.audio).on('timeupdate', (event)=>{
        let currentTime = (event.currentTarget.currentTime).toFixed(2);
        let lyricObj = this.model.data.lyricObj;
        let keyArr = Object.keys(lyricObj).sort((a,b)=>{
          return a - b ;
        });
        
        keyArr.map((key,index)=>{
          if( (currentTime - key) > 0 && ((currentTime - keyArr[index+1]) < 0 || index === keyArr.length - 1)){
            this.view.showLyric(lyricObj[key]);
          }
        })
      })
    } ,
    bindEventHubs(){
      window.eventHub.on('startPlay',()=>{
        this.model.data.status = 'start';
        this.view.audio.play();
        this.view.audio.pause();
      })

      window.eventHub.on('pause',()=>{
        if(this.model.data.status === 'ready') return;
        this.view.pause();
        this.model.data.status = 'pause';
      })
      window.eventHub.on('play',()=>{
        if(this.model.data.status === 'ready') return;
        this.view.play();
        this.model.data.status = 'playing';
      })
    },
    getSongId(){
      let serachString = window.location.search;
      let songId = serachString.split('=')[1];
      this.model.setId(songId);
    },
    getSong(){
      
      return this.model.fetch().then(()=>{
        this.view.render(this.model.data);
        this.model.data.lyricObj = this.view.renderLyric(this.model.data.song.lyric);

        
      });
      
    },
    pll(callback){
      callback();
    },
    ttt(){
      let timer;
      timer = setInterval(()=>{
        console.log(222);
        if(this.model.data.song){
          console.log('aaaa');
          var audio = (function(){
            var _audio = new Audio();
            _audio.src = 'http://pc5zw9rcj.bkt.clouddn.com/%E4%B8%BD%E6%B1%9F%E5%B0%8F%E5%80%A9%20-%20%E4%B8%80%E7%9E%AC%E9%97%B4.mp3';
            _audio.load();
            return _audio;
          })()
          console.log('audio');
          document.addEventListener('touchstart',()=>{
            console.log('tttt')
          });
          document.addEventListener("WeixinJSBridgeReady", function () {
            console.log('audio3')
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
            console.log('audio4')
              
              // 触发一下play事件
              console.log(1,audio.readyState);
              audio.play();
              audio.oncanplay = ()=>{
                
                console.log(audio.readyState);
              }
            });
          }, false);
          console.log('audio2')
          
          
          clearInterval(timer);
        }
      },100)
    }
  }

  controller.init(view,model);
}