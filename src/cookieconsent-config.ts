import * as CookieConsent from "vanilla-cookieconsent";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const CAT_NECESSARY = "necessary";
const CAT_ANALYTICS = "analytics";
const SERVICE_ANALYTICS_STORAGE = "analytics_storage";

function updateGtagConsent() {
  // Check if analytics category is accepted
  const analyticsAccepted = CookieConsent.acceptedCategory(CAT_ANALYTICS);

  console.log("Analytics category accepted:", analyticsAccepted);

  // Use the global gtag function
  window.gtag("consent", "update", {
    analytics_storage: analyticsAccepted ? "granted" : "denied",
    ad_storage: analyticsAccepted ? "granted" : "denied",
    functionality_storage: analyticsAccepted ? "granted" : "denied",
    personalization_storage: analyticsAccepted ? "granted" : "denied",
  });

  console.log("Consent update sent:", {
    analytics_storage: analyticsAccepted ? "granted" : "denied",
    ad_storage: analyticsAccepted ? "granted" : "denied",
    functionality_storage: analyticsAccepted ? "granted" : "denied",
    personalization_storage: analyticsAccepted ? "granted" : "denied",
  });
}

/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */
CookieConsent.run({
  // Trigger consent update when user choices change
  onFirstConsent: () => {
    updateGtagConsent();
  },
  onConsent: () => {
    updateGtagConsent();
  },
  onChange: () => {
    updateGtagConsent();
  },

  categories: {
    [CAT_NECESSARY]: {
      enabled: true, // this category is enabled by default
      readOnly: true, // this category cannot be disabled
    },
    [CAT_ANALYTICS]: {
      autoClear: {
        cookies: [
          {
            name: /^_ga/, // regex: match all cookies starting with '_ga'
          },
          {
            name: "_gid", // string: exact cookie name
          },
        ],
      },
      // See: https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
      services: {
        [SERVICE_ANALYTICS_STORAGE]: {
          label:
            "Enables storage (such as cookies) related to analytics e.g. visit duration.",
        },
      },
    },
  },

  language: {
    default: "en",
    translations: {
      en: {
        consentModal: {
          title: "We use cookies",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
        },
        preferencesModal: {
          title: "Manage cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Accept current selection",
          closeIconLabel: "Close modal",
          sections: [
            {
              title: "Strictly Necessary cookies",
              description:
                "These cookies are essential for the proper functioning of the website and cannot be disabled.",

              //this field will generate a toggle linked to the 'necessary' category
              linkedCategory: "necessary",
            },
            {
              title: "Performance and Analytics",
              description:
                "These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.",
              linkedCategory: "analytics",
            },
          ],
        },
      },
    },
  },
});
