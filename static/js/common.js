$(document).ready(function() {
  $(document).on("click", ".about_list > ul > li", function(e) {
    var target = $(e.currentTarget);

    $(".header")
      .stop()
      .slideToggle(400);

    e.preventDefault();
  });
});
