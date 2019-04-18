{
  let view = {
    el: '#playLists_form',
    template: `<form action="" class="upload-form">
        <div class="text-title"> 新建歌单 </div>
        <div class="row-box">
          <label>
            <span class="name">名称</span>
            <input name="name" type="text" class="ipt" value="--name--">
          </label>

          <label>
            <span class="name">图片</span>
            <input name="imgUrl" type="text" class="ipt" value="--imgUrl--">
          </label>
        </div>
        <div class="row-box">
          <label>
            <span class="name">描述</span>
            <textarea class="textarea lg" name="description" cols="30" rows="10">--description--</textarea>
          </label>
        </div>
        <div class="row-box">
          <div class="btn-box"> 
            <button class="btn">确认</button>
            
          </div>
          <div class="btn-box"> 
            <button class="btn" id="remove-playList">删除</button>
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

      if(!data.playList.id){
        $('#remove-playList').parent().hide();
      }

    },
    reset(placeholders){
      this.render({placeholders,playList:{}})
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
    modefied(){
      console.log(this.data.playList.id);
      // 第一个参数是 className，第二个参数是 objectId
      let todo = AV.Object.createWithoutData('PlayList', this.data.playList.id);
      this.data.placeholders.map(pl=>{
        // 修改属性
        todo.set(pl, this.data.playList[pl]);
      })
      // 保存到云端
      return todo.save();
    },
    remove(){
      // 第一个参数是 className，第二个参数是 objectId
      let todo = AV.Object.createWithoutData('PlayList', this.data.playList.id);
      return todo.destroy();
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
      this.bindEventHubs();
    },
    bindEvents(){
      this.view.$el.on('submit','form',e =>{
        e.preventDefault();
        let playList = {}
        this.model.data.placeholders.map(item=>{
          playList[item] = this.view.$el.find(`[name='${item}']`).val();
        })

        Object.assign(this.model.data.playList, playList);
        if(this.model.data.playList.id){
          this.modifiedData();
        }else {
          this.createData();
        }
      })

      this.view.$el.on('click','#remove-playList', e => {
        e.preventDefault();
        this.removeData();
      })
    },
    bindEventHubs(){
      window.eventHub.on('uploadImg',url=>{
        this.view.$el.find('[name="imgUrl"]').val(url);
      })
      window.eventHub.on('newPlayList',()=>{
        if(this.model.data.playList.id){
          this.model.resetData();
          this.view.reset(this.model.data.placeholders);
        }
        this.view.$el.find('.text-title').html('新建歌单');
      })
      window.eventHub.on('selectList',data=>{
        this.model.data.playList = data;
        this.view.render(this.model.data);
        this.view.$el.find('.text-title').html('编辑歌单');
      })
    },
    createData(){
      return this.model.create().then(()=>{
        let playList = JSON.parse(JSON.stringify(this.model.data.playList));
        window.eventHub.emit('saveData',playList);
        this.model.resetData();
        this.view.reset(this.model.data.placeholders);
      }) 
    },
    modifiedData(){
      return this.model.modefied().then(()=>{
        window.eventHub.emit('modifiedData',this.model.data.playList);
        this.model.resetData();
        this.view.reset(this.model.data.placeholders);
      })
    },
    removeData(){
      return this.model.remove().then(()=>{
        window.eventHub.emit('removeData',this.model.data.playList);
        this.model.resetData();
        this.view.reset(this.model.data.placeholders);
      })
    }
  }

  controller.init(view,model);
}