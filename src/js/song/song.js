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
      this.audio.src = song.url;
      this.$name.text(song.name);
      this.$author.text(song.author);
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
      console.log(index,$nowLyric.text());
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
      this.getSong();
      this.bindEvents();
      this.bindEventHubs();
    },
    bindEvents(){
      this.view.$songContent.on('click',e=>{
        if(this.model.data.status === 'playing'){
          window.eventHub.emit('pause');
        }else {
          window.eventHub.emit('play');
        }
      })
      this.view.audio.ontimeupdate = (event)=>{
        let currentTime = (event.timeStamp/1000).toFixed(2);
        let lyricObj = this.model.data.lyricObj;
        let keyArr = Object.keys(lyricObj).sort((a,b)=>{
          return a - b ;
        });
        

        keyArr.map((key,index)=>{
          if( (currentTime - key) > 0 && ((currentTime - keyArr[index+1]) < 0 || index === keyArr.length - 1)){
            this.view.showLyric(lyricObj[key]);
          }
        })
      }
    } ,
    bindEventHubs(){
      window.eventHub.on('startPlay',()=>{
        $(this.view.audio).on('canplay',()=>{
          this.view.play();
          this.model.data.status = 'playing';
          this.view.$songContent.addClass('active');
        })
      })
      window.eventHub.on('pause',()=>{
        if(this.model.data.status === 'ready') return;
        this.view.pause();
        this.model.data.status = 'pause';
        this.view.$songContent.removeClass('active');
      })
      window.eventHub.on('play',()=>{
        if(this.model.data.status === 'ready') return;
        this.view.play();
        this.model.data.status = 'playing';
        this.view.$songContent.addClass('active');
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
    }
  }

  controller.init(view,model);
}