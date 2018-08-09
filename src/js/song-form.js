{
  let view = {
    el: '#song_form',
    template: `
    <form action="">
      <div class="text-title">
        新建歌曲
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌 名</span>
          <input type="text" class="ipt">
        </label>
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌 手</span>
          <input type="text" class="ipt">
        </label>
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌曲外链</span>
          <input type="text" class="ipt">
        </label>
      </div>
      <div class="row-box">
        <div class="btn-box">
          <button>确认</button>
        </div>
      </div>
    </form>
    `,
    render(data){
      $(this.el).html(this.template);
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
    }
  }

  controller.init(view,model);
}