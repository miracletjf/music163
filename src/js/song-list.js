{
  let view = {
    el: '.songList-container',
    songs: [],
    template: ` <ul class="songList"></ul>`,
    render(){
      var ul = $(this.template);
      this.songs.map(item=>{
        ul.append($('<li></li>').html(item));
      })
      $(this.el).html(ul);
    },
    create(data){
      this.songs.push(data);
      this.render();
    }
  }
  let model = {}
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
      window.eventHub.on('saveData',(data)=>{
        this.view.create(data);
      })
    }
  }

  controller.init(view,model);
}