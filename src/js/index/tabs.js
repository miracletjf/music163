{
  let view = {
    el: '#tabs',
    template: `<ol class="tabs-nav">
      <li class="active" data-tab-name="page-1"> <div class="text">推荐音乐</div> </li>
      <li data-tab-name="page-2"> <div class="text">热歌榜</div> </li>
      <li data-tab-name="page-3"> <div class="text">搜索</div> </li>
    </ol> `,
    init(){
      this.$el = $(this.el);
    } ,
    render(){
      this.$el.append(this.template);
    }
  }

  let model = {
    data:{ }
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.init();
      this.view.render();
    },
    bindEvents(){
      this.view.$el.on('click','.tabs-nav>li',(e)=>{
        let $li = $(e.currentTarget);
        let tabName = $li.attr('data-tab-name');
        window.eventHub.emit('selectTab',tabName);
      })
    }
  }

  controller.init(view,model);
}