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
        // 暂停处：2018年9月14日01:17:36
        // 开始：2018年9月19日21:03:36
        window.eventHub.emit('newPlayList');
      })
    },
    bindEventHubs(){
      window.eventHub.on('selectList',id=>{
        this.view.unActive();
      })
    }
  }

  controll.init(view,model)

}