{
  let view = {
    el: '#song_form',
    template: `
    <form action="" class="upload-form">
      <div class="row-box">
        <label>
          <span class="name">歌 名</span>
          <input name="name" type="text" class="ipt" value="--name--">
        </label>

        <label>
          <span class="name">歌 手</span>
          <input name="author" type="text" class="ipt" value="--author--">
        </label>
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌曲外链</span>
          <input name="url" type="text" class="ipt" value="--url--">
        </label>

        <label>
          <span class="name">歌单</span>
          <select id="depend" class="ipt"></select>
        </label>
      </div>
      <div class="row-box">
        <label>
          <span class="name">图片</span>
          <input name="imgUrl" type="text" class="ipt lg" value="--imgUrl--">
        </label>
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌词</span>
          <textarea name="lyric" class="textarea lg" cols="30" rows="10">--lyric--</textarea>
        </label>
      </div>
      <div class="row-box"> 
        <div class="btn-box"> <button class="btn" type="submit">确认</button> </div> 
        <div class="btn-box"> <button class="btn" id="remove-song">删除</button> </div> 
      </div>
    </form> `,
    render(data){
      let song = data.song ||{};
      let playLists = data.playLists;
      let placeholders = ['name','author','url','id','imgUrl','lyric','depend'];
      let html = this.template;
      placeholders.map(item=>{
        html = html.replace(`--${item}--`,song[item] || '');
      })
      $(this.el).html(html);
      if(song.id){
        $(this.el).find('form').prepend('<div class="text-title"> 编辑歌曲 </div>')
      }else {
        $(this.el).find('form').prepend('<div class="text-title"> 新建歌曲 </div>')

        $(this.el).find('#remove-song').parent().hide();
      }
      this.renderOptions(playLists,song.depend);
      
    },
    renderOptions(playLists,depend){
      let optionsHtml = '<option>请选择</option>';
      playLists.map(option => {
        optionsHtml += `<option value="${option.id}">${option.name}</option>`
      });

      $(this.el).find('#depend').append(optionsHtml);
            
      if(depend){
        $(this.el).find(`#depend option[value="${depend}"]`).prop('selected',true);
      }
      return optionsHtml;
    },
    reset(data){
      this.render({playLists:data.playLists});
    },
    findElements(selector){
      return $(this.el).find(selector);
    },
    changeTitle(title){
      this.findElements('.text-title').text(title);
    }
  }

  let model = {
    data: {
      song: {id:'',name:'',author:'',url:'',imgUrl:'',lyric:'',depend:''},
      playLists:[]
    },
    create(data){
      let {name,author,url,imgUrl,lyric,depend} = data;
      let Song = AV.Object.extend('Song');
      let song = new Song();

      return song.save({name,author,url,imgUrl,lyric,depend}).then(object => {
        let {id,attributes} = object;
        Object.assign(this.data, {id,...attributes});
      })
    },
    modify(data){
        // 第一个参数是 className，第二个参数是 objectId
        let song = AV.Object.createWithoutData('Song', data.id);
        // 修改属性
        ('name author url imgUrl lyric depend').split(' ').map(item=>{
          song.set(item,data[item]);
        });
        // 关联歌单
        let playlist = AV.Object.createWithoutData('PlayList', data.depend);
        song.set('dependent',playlist)
        // 保存到云端
        return song.save();
    },
    remove(data){
      // 第一个参数是 className，第二个参数是 objectId
      let song = AV.Object.createWithoutData('Song', data.id);
      return song.destroy();
    },
    getPlayLists(){
      let query = new AV.Query('PlayList');
      // 批量获取
      return query.find().then(playLists=>{
        this.data.playLists = playLists.map(playList=>{
          return {id: playList.id,...playList.attributes};
        })
      });
    },
    resetData(){
      this.data.song = {id:'',name:'',author:'',url:'',imgUrl:'',lyric:'',depend:''};
    }
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.model.getPlayLists().then(()=>{
        this.view.render(this.model.data);
      })
      this.bindEvents();
      this.bindEventHubs();
    },
    bindEvents(){
      $(this.view.el).on('change','#depend',e=>{
        console.log($(e.currentTarget).val());
      })

      $(this.view.el).on('submit','form',(e)=>{
        e.preventDefault();
        let names = ('name author url imgUrl lyric depend').split(' ');
        let song = {};
        names.map(name=>{
          song[name] = $(this.view.el).find(`[name="${name}"]`).val();
        })

        let $selectEle = $(this.view.el).find('#depend');
        song.depend = $selectEle.val() != '请选择' ? $selectEle.val() : '';
        

        Object.assign(this.model.data.song,song);
        
        console.log('onsubmit');
        console.log(this.model.data.song);

        if(this.model.data.song.id){
          this.modifyData(this.model.data.song)
        }else{
          this.createData(this.model.data.song);
        }
      })

      $(this.view.el).on('click','#remove-song',e => {
        e.preventDefault();
        this.removeData(this.model.data.song);
      })
    },
    bindEventHubs(){
      window.eventHub.on('upload',data => {
        //去除文件名后缀
        data.name = data.name.replace(/\.mp3/,'');
        this.model.data.song = data;
        this.view.render(this.model.data);
      })
      window.eventHub.on('uploadImg', imgUrl =>{
        this.model.data.song.imgUrl = imgUrl;
        this.view.render(this.model.data);
      })
      window.eventHub.on('selectItem',data=>{
        this.model.data.song = data;
        this.view.activeItem = $('[data-song-id="'+data.id+'"]');
        this.view.render(this.model.data);
      })
      window.eventHub.on('newSong',()=>{
        if(this.model.data.song.id){
          this.model.resetData();
        }
        this.view.reset(this.model.data);
      })
      window.eventHub.on('modifyData',()=>{
        this.model.resetData();
        this.view.reset(this.model.data);
      })
      window.eventHub.on('removeData',()=>{
        this.model.resetData();
        this.view.reset(this.model.data);
      })
    },
    createData(data){
      return this.model.create(data).then(()=>{
        this.view.reset(this.model.data);
        // 拷贝对象，
        //   否则将会传递对象地址，
        //   产生bug，列表数据指向同一个地址
        console.log(this.model.data.song);
        let obj = JSON.parse(JSON.stringify(this.model.data.song));
        window.eventHub.emit('saveData',obj);
        this.model.resetData();
      });
    },
    modifyData(data){
      return this.model.modify(data).then(()=>{
        this.view.render(this.model.data);
        let obj = JSON.parse(JSON.stringify(this.model.data.song));
        window.eventHub.emit('modifyData',obj);
      })
    },
    removeData(data){
      return this.model.remove(data).then(()=>{
        let obj = JSON.parse(JSON.stringify(this.model.data.song));
        window.eventHub.emit('removeData',obj);
      })
    }

  }

  controller.init(view,model);
}