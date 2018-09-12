{
  let view = {
    el: '#playList_list',
    template: `<ul class="playList-list">
      <li>歌单1</li>
      <li>歌单2</li>
      <li>歌单3</li>
      <li>歌单4</li>
    </ul>`,
    init(){
      this.$el = $(this.el);
    },
    render(data){
      let playLists = data.playLists;
      playLists.map(playList=>{
        this.$el.append(this.template);
      })
    }
  }

  let model = {
    data: {
      playLists:[]
    }
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.init();
      this.view.render();
    },
    bindEnents(){
      window.evnetHub.on('saveData',playList=>{
        this.model.data.playLists.push(playList);
        thie.view.render(this.model.data);
      })
    }
  }

  controller.init(view,model)
}