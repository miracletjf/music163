{
  let view = {
    el: '#playList_list',
    template: `<ul class="playList-list"> </ul>`,
    init(){
      this.$el = $(this.el);
    },
    render(data){
      let playLists = data.playLists;
      let html = playLists.reduce((str,playList)=>{
        str += `<li data-play-list-id="${ playList['id'] }">${ playList['name'] }</li>`;
        return str;
      },'')
      
      $(this.template).appendTo(this.$el).append(html);
    },
    appendPlayList(playList){
      this.$el.find('ul').append(`<li data-play-list-id="${ playList['id'] }">${ playList['name'] }</li>`)
    }
  }

  let model = {
    data: {
      playLists:[]
    },
    fetchLists(){
      let query = new AV.Query('PlayList');
      // 批量获取
      return query.find().then(playLists=>{
        this.data.playLists = playLists.map(playList=>{
          return {id: playList.id,...playList.attributes};
        })
      });
    }
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.init();
      this.bindEventHubs();
      this.model.fetchLists().then(()=>{
        this.view.render(this.model.data);
        this.bindEvents();
      })
    },
    bindEventHubs(){
      window.eventHub.on('saveData',playList=>{
        console.log('-----',playList);
        this.model.data.playLists.push(playList);
        this.view.appendPlayList(playList);
      })
      window.eventHub.on('newPlayList',()=>{
        this.view.$el.find('li').removeClass('active');
      })
    },
    bindEvents(){
      this.view.$el.find('li').on('click',e=>{
        let $this = $(e.currentTarget);
        let currentId = $this.attr('data-play-list-id');
        $this.addClass('active').siblings().removeClass('active');
        window.eventHub.emit('selectList',currentId);
      })
    }
  }

  controller.init(view,model)
}