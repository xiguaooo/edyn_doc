import { defineComponent, h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import EvidenceGallery from './EvidenceGallery.vue'
import EvidenceLightbox from './EvidenceLightbox.vue'
import EvidenceImage from './EvidenceImage.vue'
import ArchiveHome from './ArchiveHome.vue'

const Layout = defineComponent({
  setup() {
    return () => h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(EvidenceLightbox)
    })
  }
})

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('EvidenceGallery', EvidenceGallery)
    app.component('EvidenceImage', EvidenceImage)
    app.component('ArchiveHome', ArchiveHome)
  }
}
