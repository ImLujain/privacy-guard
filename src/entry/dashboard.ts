





import { createApp } from "vue"

// import DashboardViewComponent from "../view/DashboardView.vue"
//import ProfileViewComponent from "../view/ProfileView.vue"

// window.addEventListener("load", () => {

//     //append app
//     const contentDetectorWrapper = document.createElement("div")
//     contentDetectorWrapper.id="dashboard-wrapper-container"
//     document.body.appendChild(contentDetectorWrapper)

//     const contentDetectorHandlerApp = createApp(DashboardViewComponent)
//    // const contentDetectorHandlerApp = createApp(ProfileViewComponent)
//     contentDetectorHandlerApp.mount("#app-content") 
// })





import App from './../view/App.vue'
import router from '../router' // <---

createApp(App).use(router).mount('#app')
