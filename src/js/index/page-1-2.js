{
  let view = {
    el: '#songList',
    template: `<li>
      <a href="" class="item">
        <h3>Summer Sunshine</h3>
        <p class="text">
          <svg class="icon icon-sq" aria-hidden="true"> <use xlink:href="#icon-sq"></use> </svg>
          时光街乐队 - Summer Sunshine
        </p>
        <i> <svg class="icon icon-bofang" aria-hidden="true"> <use xlink:href="#icon-bofang"></use> </svg> </i>
      </a>
    </li>`
  }

  let model = {
    data:{}
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
    }
  }

  controller.init(view,model);
}