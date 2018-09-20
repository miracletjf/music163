{
  let view = {
    el: '.new-playList',
    template: `新建歌曲`,
    init(){
      this.$el = $(this.el);
    },
    render(){
      this.$el.html(this.template);
    },
    active(){
      this.$el.addClass('active');
    },
    unActive(){
      this.$el.removeClass('active');
    }
  }

  let model = {}

  let controll = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.init();
      this.view.render();
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
    }
  }

  controll.init(view,model)

}