import type { AbstractView } from "./AbstractView";
import { Home } from "./Home";
import { Walkers } from "./Walkers";
import "./main.css";

let currentViewInstance: AbstractView | null = null;

const router = async () => {
  const routes = [
    { path: "/", view: Home },
    { path: "/walkers", view: Walkers },
  ];

  const currentPath = location.hash.slice(1) || "/";

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: currentPath === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);
  if (!match) {
    match = { route: routes[0], isMatch: true };
  }

  const view = new match.route.view();

  if (currentViewInstance && currentViewInstance.unmount) {
    await currentViewInstance.unmount();
  }
  currentViewInstance = view;

  const app = document.querySelector("#app") as HTMLElement;

  app.classList.add("fade-out");

  setTimeout(async () => {
    // Clear container
    app.innerHTML = "";

    // Clone HTML from Template Tag
    const template = document.getElementById(
      view.templateId
    ) as HTMLTemplateElement;
    if (template) {
      const clone = template.content.cloneNode(true);
      app.appendChild(clone);
    } else {
      app.innerHTML = "<p>Error: Template not found</p>";
    }

    // Run JS Logic
    await view.executeScript();

    app.classList.remove("fade-out");
  }, 100);
};

window.addEventListener("hashchange", router);
document.addEventListener("DOMContentLoaded", router);
