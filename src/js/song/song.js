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
    },
    render(data){
      let props = data.props;
      let song = data.song;
      let resHtml = this.template;
      props.map(item=>{
        resHtml = resHtml.replace(`{{${item}}}`,song[item]);
      })
      this.$el.append(resHtml);
    },
    play(){
      let audio = this.$el.find('audio')[0];
      audio.play();
    },
    pause(){
      let audio = this.$el.find('audio')[0];      
      audio.pause();
    }

  }

  let model = {
    data:{
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
        console.log('获取数据失败！')
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
    },
    bindEvents(){
      this.view.$el.on('click','#play',(e)=>{
        this.view.play();
      })
      this.view.$el.on('click','#pause',(e)=>{
        this.view.pause();
      })
    } ,
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