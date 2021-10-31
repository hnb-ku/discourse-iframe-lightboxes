import { apiInitializer } from "discourse/lib/api";
import loadScript from "discourse/lib/load-script";
import { iconHTML } from "discourse-common/lib/icon-library";
import featherlight from "../vendor/featherlight";

export default apiInitializer("0.8", (api) => {
  try {
    const targetIframeDomains = settings.iframe_origin_domains;

    if (!targetIframeDomains.length) {
      return;
    }

    const expandIcon = () => {
      const template = document.createElement("template");
      template.innerHTML = iconHTML("discourse-expand", {
        class: "iframe-expand-icon",
      });
      return template.content.firstChild;
    };

    const expandButton = (id) => {
      const button = document.createElement("button");
      button.classList.add(
        "btn",
        "btn-default",
        "iframe-expand-btn",
        "no-text"
      );
      button.dataset.featherlight = `#${id}`;
      button.title = I18n.t(themePrefix("expand_button_title"));
      button.append(expandIcon());

      return button;
    };

    api.decorateCookedElement(
      (post) => {
        const iframes = post.querySelectorAll("iframe");

        iframes.forEach((iframe, index) => {
          const shouldLightbox = new RegExp(targetIframeDomains).test(
            iframe.src
          );

          if (shouldLightbox) {
            iframe.id = iframe.id || Math.floor(Math.random() * 1000);
            iframe.parentNode.insertBefore(expandButton(iframe.id), iframe);
          }
        });
      },
      { id: "iframe-lightboxes" }
    );
  } catch {
    console.error("There's an issue in the iFrame lightboxes theme component");
    console.error(error);
  }
});
