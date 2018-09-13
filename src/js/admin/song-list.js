{
  let view = {
    el: '.songList-container',
    template: `<ul class="songList"></ul>`,
    render(data){
      let ul = $(this.template);
      let {songList} = data;
      songList.map(item=>{
        let li = $('<li></li>').html(item.name);
        li.attr('data-song-id',item.id);
        li.attr('data-url',item.url);
        ul.append(li);
      })
      $(this.el).html(ul);
    },
    activeItem(li){
      let $li = $(li);
      $li.addClass('active').siblings().removeClass('active');
      return $li.attr('data-song-id');
    },
    removeLiActive(){
      $(this.el).find('li').removeClass('active');
    }
  }
  let model = {
    data: {
      songList: []
    },
    fetchSongs(){
      let query = new AV.Query('Song');
      // 批量获取
      return query.find().then(songs=>{
        this.data.songList = songs.map(song=>{
          return {id: song.id,...song.attributes};
        })
      });
    }
  }
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.initSongList();
      this.bindEvents();
      this.bindEventHub();
    },
    initSongList(){
      this.model.fetchSongs().then(()=>{
        this.view.render(this.model.data);
      })
    },
    bindEvents(){
      $(this.view.el).on('click','li',(e) => {
        let id = this.view.activeItem(e.currentTarget);
        this.model.data.songList.forEach(item => {
          if(item.id === id){
            window.eventHub.emit('selectItem',item);
          }
        });
      })
    },
    bindEventHub(){
      window.eventHub.on('newSong',()=>{
        this.view.removeLiActive();
      })
      window.eventHub.on('saveData',data=>{
        this.model.data.songList.push(data);
        this.view.render(this.model.data);
      })
      window.eventHub.on('modifyData',data=>{
        let songs = this.model.data.songList;
        this.model.data.songList = songs.map(item=>{
          if(item.id === data.id){
            item = data;
          }
          return item;
        })
        this.view.render(this.model.data)
      })
    }
  }

  controller.init(view,model);
}