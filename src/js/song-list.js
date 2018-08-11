{
  let view = {
    el: '.songList-container',
    songList: [],
    template: ` <ul class="songList"></ul>`,
    render(){
      let ul = $(this.template);
      this.songList.map(item=>{
        let li = $('<li></li>').html(item.name);
        ul.append(li);
      })
      $(this.el).html(ul);
    },
    create(data){
      this.songList.push(data);
      this.render();
    }
  }
  let model = {
    songList: [],
    fetchSongs(){
      let Song = AV.Object.extend('Song');
      var query = new AV.Query('Song');

      // 批量获取
      return query.find().then(todos=>{
        this.songList = todos.map(todo=>{
          return {id:todo.id,...todo.attributes};
        })
      });
    }
  }
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.model.fetchSongs().then((todos)=>{
        this.view.songList = this.model.songList;
        this.view.render();
      })
      window.eventHub.on('saveData',data=>{
        this.view.create(data);
      })
    }
  }

  controller.init(view,model);
}