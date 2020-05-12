import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';

export default createWidget('sidebar', {
  tagName: 'div.sidebar',
  buildKey: () => 'sidebar',

  html(attrs, state) {
  	if (!Discourse.SiteSettings.sidebar_enable || this.site.mobileView)
  		return;

    const result = [];
    var self = this;

	result.push(self.attach('sidebar-cat'));
	result.push(self.attach('sidebar-custom-content'));
        
    return result;
  },

});
