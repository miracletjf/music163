{
  let view = {
    el: '#new-playList',
    template: `新建歌单`,
    init(){
      this.$el = $(this.el);
    },
    render(){
      this.$el.html(this.template);
    },
    active(){
      this.$el.parent().addClass('active');
    },
    unActive(){
      this.$el.parent().removeClass('active');
    }
  }

  let model = {}

  let controll = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.init();
      this.view.render();
      this.view.active();
      this.bindEvents();
      this.bindEventHubs();
    },
    bindEvents(){
      this.view.$el.on('click',e=>{
        this.view.active();
        window.eventHub.emit('newPlayList');
      })
    },
    bindEventHubs(){
      window.eventHub.on('selectList',id=>{
        this.view.unActive();
      })
      window.eventHub.on('modifiedData',data=>{
        this.view.active();
      })
      window.eventHub.on('removeData',data=>{
        this.view.active();
      })
    }
  }

  controll.init(view,model)

}