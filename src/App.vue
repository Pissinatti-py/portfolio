<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CommandPalette from '@/components/ui/CommandPalette.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <div class="min-h-screen bg-[#0f0f11] text-[#e4e4e7]">
    <AppSidebar />
    <div class="lg:ml-[300px]">
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <AppFooter />
    </div>
    <CommandPalette />
  </div>
</template>
