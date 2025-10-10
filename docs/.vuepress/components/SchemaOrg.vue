<template>
  <component :is="'script'" type="application/ld+json">
    {{ schemaData }}
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageData, usePageFrontmatter } from '@vuepress/client'

const props = defineProps<{
  type?: 'website' | 'article' | 'faq' | 'software'
}>()

const page = usePageData()
const frontmatter = usePageFrontmatter()

const schemaData = computed(() => {
  const baseUrl = 'https://waitmoon.com'
  const schemas: any[] = []

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ice',
    url: baseUrl,
    logo: `${baseUrl}/images/hero.png`,
    description: 'Ice - 轻量级可视化Java规则引擎和业务编排框架',
    founder: {
      '@type': 'Person',
      name: 'WaitMoon',
    },
    sameAs: [
      'https://github.com/zjn-zjn/ice',
      'https://gitee.com/waitmoon/ice',
    ],
  }

  // Software Application Schema
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ice',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '100',
    },
    softwareVersion: '1.5.3',
    description: 'Ice is a lightweight, high-performance Java rule engine and business orchestration framework',
    programmingLanguage: 'Java',
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: generateBreadcrumbs(),
  }

  // 根据页面类型添加不同的schema
  if (props.type === 'website' || page.value.path === '/') {
    schemas.push(organizationSchema, softwareSchema)
  } else if (props.type === 'article' || props.type === 'faq') {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': props.type === 'faq' ? 'FAQPage' : 'TechArticle',
      headline: frontmatter.value.title || page.value.title,
      description: frontmatter.value.description || '',
      author: {
        '@type': 'Person',
        name: 'WaitMoon',
      },
      publisher: organizationSchema,
      datePublished: page.value.git?.createdTime
        ? new Date(page.value.git.createdTime).toISOString()
        : undefined,
      dateModified: page.value.git?.updatedTime
        ? new Date(page.value.git.updatedTime).toISOString()
        : undefined,
    }
    schemas.push(articleSchema, breadcrumbSchema)
  } else if (props.type === 'software') {
    schemas.push(softwareSchema, breadcrumbSchema)
  } else {
    schemas.push(breadcrumbSchema)
  }

  return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)
})

function generateBreadcrumbs() {
  const path = page.value.path
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://waitmoon.com',
    },
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    breadcrumbs.push({
      '@type': 'ListItem',
      position: index + 2,
      name: segment,
      item: `https://waitmoon.com${currentPath}`,
    })
  })

  return breadcrumbs
}
</script>

