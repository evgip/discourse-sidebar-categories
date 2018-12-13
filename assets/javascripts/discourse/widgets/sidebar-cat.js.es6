import { createWidget, applyDecorators } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import DiscourseURL from 'discourse/lib/url';
import { ajax } from 'discourse/lib/ajax';
import { NotificationLevels } from "discourse/lib/notification-levels";

const flatten = array => [].concat.apply([], array);

export default createWidget('sidebar-cat', {
  tagName: 'div.cat-panel',

  lookupCount(type) {
    const tts = this.register.lookup("topic-tracking-state:main");
    return tts ? tts.lookupCount(type) : 0;
  },

  showUserDirectory() {
    if (!this.siteSettings.enable_user_directory) return false;
    if (this.siteSettings.hide_user_profiles_from_public && !this.currentUser)
      return false;
    return true;
  },

  panelContents() {
    const { currentUser } = this;
    const results = [];

    results.push(this.listCategories());

    return results;
  },
 
  listCategories() {

       const maxCategoriesToDisplay = this.siteSettings
            .header_dropdown_category_count;
    
    let categories = this.site.get("categoriesByCount");

    if (this.currentUser) {
      const allCategories = this.site
        .get("categories")
        .filter(c => !c.parent_category_id) // - subcategory
        .filter(c => c.notification_level !== NotificationLevels.MUTED);

      categories = allCategories
        .filter(c => c.get("newTopics") > 0 || c.get("unreadTopics") > 0)
        .sort((a, b) => {
          return (
            b.get("newTopics") +
            b.get("unreadTopics") -
            (a.get("newTopics") + a.get("unreadTopics"))
          );
        });

      const topCategoryIds = this.currentUser.get("top_category_ids") || [];
      topCategoryIds.forEach(id => {
        const category = allCategories.find(c => c.id === id);
        if (category && !categories.includes(category)) {
          categories.push(category);
        }
      });

      categories = categories.concat(
        allCategories
          .filter(c => !categories.includes(c))
         // .filter(c => !c.parent_category_id) // - subcategory
          .sort((a, b) => b.topic_count - a.topic_count)
      );
    } else {
	
	   categories = categories
	   .filter(c => !c.parent_category_id);
	
  	}

    const moreCount = categories.length - maxCategoriesToDisplay;
    categories = categories.slice(0, maxCategoriesToDisplay);

    var cslug = this.attrs.cslug;
    return this.attach("cat-categories", { categories, moreCount, cslug });
},

  html() {
    if (this.site.mobileView)
    return; 
    return this.attach('cat-panel', { contents: () => this.panelContents() });
  },

  clickOutside() {
    this.sendWidgetAction('toggleHamburger');
  }
});
