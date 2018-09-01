{
  let view = {
    el: '#songPage',
    template: `
    <div class="song-box" data-song-id="{{id}}">
      <h3>{{name}}</h3>
      <p>{{author}}</p>
      <audio src="{{url}}" autoplay>
        Your browser does not support the <code>audio</code> element.
      </audio> 
    </div>`,
    init(){
      this.$el = $(this.el);
    },
    render(data){
      let props = data.props;
      let song = data.song;
      props.map(item=>{
        this.template.replace(`{{${item}}}`,song[item]);
      })
    }

  }

  let model = {
    data:{
      props: ['id','name','author','url']
    },
    fetch(songId){
      var query = new AV.Query('Song');
      return query.get(songId).then(song =>{
        this.data.song = {id: song.id,...song.attributed};
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
      this.getSongId().then(()=>{
        this.view.render(this.model.data);
      });
    },
    getSongId(){
      let serachString = window.location.search;
      let songId = serachString.split('=')[1];
      return this.model.fetch(songId);
    }
  }

  controller.init(view,model);
}