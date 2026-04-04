// API Configuration
// Change this to your backend URL when deploying
const DEV_API_URL = "http://167.114.129.138:5000"; // Hosted backend
const PROD_API_URL = "http://167.114.129.138:5000"; // Hosted backend

// Use React Native's built-in __DEV__ global
declare const __DEV__: boolean;

export const config = {
  apiBaseUrl:
    typeof __DEV__ !== "undefined" && __DEV__ ? DEV_API_URL : PROD_API_URL,
  appName: "Corrado's Restaurant & Bar",
  appVersion: "1.0.0",
  websocketEnabled: true,

  // Business Info
  business: {
    name: "Corrado's Restaurant and Bar",
    tagline: "A Taste of Italy in Whitby",
    address: "38 Baldwin Street, Whitby, ON, L1M 1A2",
    phone: "(905) 655-3100",
    email: "corradosrestaurant@rogers.com",
    hours: "Mon - Sun: 12pm - 10:30pm",
    orderUrl: "https://corradorestaurantandbar.orderingclub.com/",
    giftCardsUrl: "https://giftcards.bluestreakpos.net/",
    social: {
      facebook: "https://www.facebook.com/corradosrestaurant",
      instagram: "https://www.instagram.com/corrados_restaurant/",
      yelp: "https://www.yelp.ca/biz/corrados-restaurant-and-bar-whitby",
      tripadvisor:
        "https://www.tripadvisor.ca/Restaurant_Review-g182188-d4560767-Reviews-Corrado_s_Restaurant_Bar-Whitby_Ontario.html",
    },
  },

  // Cache durations (ms)
  cache: {
    menu: 5 * 60 * 1000, // 5 minutes
    specials: 5 * 60 * 1000,
    events: 10 * 60 * 1000, // 10 minutes
    stories: 10 * 60 * 1000,
    partyMenu: 15 * 60 * 1000, // 15 minutes
  },
} as const;
