{
  let view = {
    el: '#playList_list',
    template: `<ul class="playList-list"> </ul>`,
    init(){
      this.$el = $(this.el);
    },
    render(data){
      console.log(2222);
      let playLists = data.playLists;
      let html = ''
      console.log(playLists);
      playLists.map(playList=>{
        html += `<li data-play-list-id="${ playList['id'] }">${ playList['name'] }</li>`;
      })
      
      $(this.template).appendTo(this.$el).append(html);
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
      this.view.render(this.model.data);
      this.bindEnentHubs();
    },
    bindEnentHubs(){
      window.eventHub.on('saveData',playList=>{
        console.log('-----',playList);
        this.model.data.playLists.push(playList);
        this.view.render(this.model.data);
      })
    }
  }

  controller.init(view,model)
}