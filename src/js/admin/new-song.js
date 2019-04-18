{
  let view = {
    el: '#new-song',
    template: `新建歌曲`,
    render(data){
      $(this.el).html(this.template);
    },
    active(){
      $(this.el).parent().addClass('active');
    },
    deActive(){
      $(this.el).parent().removeClass('active');
    }
  }

  let model = { 
    data:{}
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
      this.view.active();      
      this.bindEvents();
      this.bindEventHub();
    },
    bindEventHub(){
      window.eventHub.on('upload',data=>{
        this.view.active();
        this.model.data = data;
      })
      // window.eventHub.on('saveData',data=>{
      //   this.view.deActive();
      // })
      window.eventHub.on('selectItem',data=>{
        this.view.deActive();
        this.model.data = data;
      })
      window.eventHub.on('newSong',()=>{
        this.view.active();
        this.model.data = {};
      })
      window.eventHub.on('modifyData',data=>{
        this.view.active();
      })
      window.eventHub.on('removeData',data=>{
        this.view.active();
      })
    },
    bindEvents(){
      $(this.view.el).on('click',e=>{
        if(this.model.data.id){
          window.eventHub.emit('newSong');
        }
      })
    }
  }

  controller.init(view,model);
}