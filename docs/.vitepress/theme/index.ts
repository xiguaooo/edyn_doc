import DefaultTheme from 'vitepress/theme'
import './style.css'
import EvidenceGallery from './EvidenceGallery.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('EvidenceGallery', EvidenceGallery)
  }
}
