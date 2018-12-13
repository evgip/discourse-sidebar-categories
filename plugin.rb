# name: discourse-sidebar-categories
# about: design site Toxu.ru
# version: 0.1
# authors:  Evg
# url: https://github.com/Toxuru/discourse-sidebar-categories

register_asset "stylesheets/style.scss"

after_initialize do
  
# Post extension
  add_to_class :post, :excerpt_for_topic do
      Post.excerpt(cooked, 300, strip_links: true)
  end
  add_to_serializer(:listable_topic, :include_excerpt?) { true }

end
