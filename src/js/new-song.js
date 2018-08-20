{
  let view = {
    el: '.new-song',
    template: `新建歌曲`,
    render(data){
      $(this.el).html(this.template);
    },
    active(){
      $(this.el).addClass('active');
    },
    deActive(){
      $(this.el).removeClass('active');
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
        this.view.active();
      })
      // window.eventHub.on('saveData',data=>{
      //   this.view.deActive();
      // })
      window.eventHub.on('selectItem',data=>{
        this.view.deActive();
      })
      window.eventHub.on('newSong',()=>{
        this.view.active();
      })
    },
    bindEvents(){
      $(this.view.el).on('click',e=>{
        window.eventHub.emit('newSong');
      })
    }
  }

  controller.init(view,model);
}