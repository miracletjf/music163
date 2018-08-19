{
  let view = {
    el: '.new-song',
    template: `新建歌曲`,
    render(data){
      $(this.el).html(this.template);
    },
    active(elemnt){
      window.eventHub.emit('newSong');
    }
  }

  let model = { }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
      this.bindEvents();
      this.bindEventHub();
    },
    bindEventHub(){
      window.eventHub.on('upload',data=>{
        $(this.view.el).addClass('active');
      })
      window.eventHub.on('saveData',data=>{
        $(this.view.el).removeClass('active');
      })
      window.eventHub.on('selectItem',data=>{
        $(this.view.el).removeClass('active');
      })
      window.eventHub.on('newSong',()=>{
        $(this.view.el).addClass('active');
      })
    },
    bindEvents(){
      $(this.view.el).on('click',e=>{
        this.view.active(e.currentTarget);
      })
    }
  }

  controller.init(view,model);
}