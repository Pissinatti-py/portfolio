<script setup lang="ts">
import TopNav from '@/components/layout/TopNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import BuildSection from '@/components/sections/BuildSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import CommandPalette from '@/components/ui/CommandPalette.vue'
import SiteBackground from '@/components/ui/SiteBackground.vue'
</script>

<template>
  <SiteBackground />

  <TopNav />

  <main>
    <HeroSection />
    <BuildSection />
    <ProjectsSection />
    <ExperienceSection />
    <SkillsSection />
    <AboutSection />
    <ContactSection />
  </main>

  <AppFooter />
  <CommandPalette />
</template>
