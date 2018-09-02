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
    },
    render(data){
      let props = data.props;
      let song = data.song;
      this.audio.src = song.url;
      this.$name.text(song.name);
      this.$author.text(song.author);
      window.eventHub.emit('startPlay');
    },
    play(){
      this.audio.play();
    },
    pause(){
      this.audio.pause();
    }

  }

  let model = {
    data:{
      status: 'ready',
      props: ['id','name','author','url']
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
    } ,
    bindEventHubs(){
      window.eventHub.on('startPlay',()=>{
        $(this.view.audio).on('canplay',()=>{
          console.log(1);
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
      });
    }
  }

  controller.init(view,model);
}