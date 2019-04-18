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
        this.model.data.playLists.push(playList);
        this.view.appendPlayList(playList);
      })
      window.eventHub.on('newPlayList',()=>{
        this.view.$el.find('li').removeClass('active');
      })
      window.eventHub.on('modifiedData',data => {
        this.model.data.playLists.map((playList,index)=>{
          if(playList.id === data.id){
            this.model.data.playLists[index] = data;
            this.view.$el.find('li').eq(index).text(data.name).removeClass('active');                     
          }
        })
      })
      window.eventHub.on('removeData', data =>{
        let index = this.model.data.playLists.findIndex(playList => playList.id === data.id);
        if(index != -1){
          this.model.data.playLists.splice(index,1)
          this.view.$el.find('li').eq(index).remove();
        }
      })
    },
    bindEvents(){
      this.view.$el.on('click','li',e=>{
        let $this = $(e.currentTarget);
        let playLists = this.model.data.playLists;
        let currentId = $this.attr('data-play-list-id');
        $this.addClass('active').siblings().removeClass('active');
        playLists.map(playList => {
          if(playList.id === currentId){
            window.eventHub.emit('selectList',playList);
          }
        })
      })
    }
  }

  controller.init(view,model)
}