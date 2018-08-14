{
  let view = {
    el: '.songList-container',
    template: ` <ul class="songList"></ul>`,
    render(data){
      let ul = $(this.template);
      let {songList} = data;
      songList.map(item=>{
        console.log(item)
        let li = $('<li></li>').html(item.name);
        li.attr('data-song-id',item.id);
        li.attr('data-url',item.url);
        ul.append(li);
      })
      $(this.el).html(ul);
    }
  }
  let model = {
    data: {
      songList: []
    },
    fetchSongs(){
      var query = new AV.Query('Song');
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
      this.model.fetchSongs().then(()=>{
        console.log(this.model.data.songList);
        this.view.render(this.model.data);
      })
      window.eventHub.on('saveData',data=>{
        this.model.data.songList.push(data);
        this.view.render(this.model.data);
      })
    }
  }

  controller.init(view,model);
}