{
  let view = {
    el: '#playLists_form',
    template: `<form action="">
    <div class="text-title"> 新建歌曲 </div>
        <div class="row-box">
          <label>
            <span class="name">名称</span>
            <input name="name" type="text" class="ipt" value="--name--">
          </label>
        </div>
        <div class="row-box">
          <label>
            <span class="name">图片</span>
            <input name="imgUrl" type="text" class="ipt" value="--imgUrl--">
          </label>
        </div>
        <div class="row-box">
          <label>
            <span class="name">描述</span>
            <textarea name="description" cols="30" rows="10">--description--</textarea>
          </label>
        </div>
        <div class="row-box">
          <div class="btn-box"> 
            <button>确认</button>
          </div>
        </div>
      </form> `,
    init(){
      this.$el = $(this.el);
    },
    render(data){
      let placeholders = data.placeholders;
      let html = this.template;
      
      placeholders.map(item=>{
        html = html.replace(`--${item}--`,data.playList[item] || '');
      })

      this.$el.html(html);
    }

  
  }

  let model = {
    data:{
      placeholders: ['name','imgUrl','description'],
      playList: {}
    },
    create(){
      let {name,imgUrl,description} = this.data.playList;
      let PlayList = AV.Object.extend('PlayList');
      let playList = new PlayList();
      return playList.save({name,imgUrl,description}).then(object=>{
        let {id,attributes} = object;
        Object.assign(this.data.playList, {id,...attributes});
      })
    },
    resetData(){
      this.data.playList = {id:'',name:'',imgUrl:'',description:''}
    }
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.init();
      this.view.render(this.model.data);
      this.bindEvents();
    },
    bindEvents(){
      this.view.$el.on('submit','form',e =>{
        e.preventDefault();
        let playList = {}
        this.model.data.placeholders.map(item=>{
          playList[item] = this.view.$el.find(`[name='${item}']`).val();
        })

        Object.assign(this.model.data.playList, playList);


        this.createData();
      })
    },
    createData(){
      return this.model.create().then(()=>{
        let playList = JSON.parse(JSON.stringify(this.model.data.playList));
        console.log(playList);
        window.eventHub.emit('saveData',playList);
        this.view.reset();
        this.model.resetData();
      })
    }
  }

  controller.init(view,model);
}