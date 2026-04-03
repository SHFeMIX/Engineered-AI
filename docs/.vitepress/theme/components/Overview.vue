<script setup lang="ts">
import { data } from '../../../index.data.ts'
import { useRoute } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()
const targetPath = computed(() => route.path.split('/').slice(2, -1).join('/'))

const posts = computed(() => {
    const path = targetPath.value
    return data.find(item => item.link === 'https://' + path)?.posts || []
})

function getSlug(source: string) {
    const parts = source.split('/').filter(p => p)
    const last = parts[parts.length - 1]
    return last || parts[parts.length - 2] || ''
}
</script>

<template>
    <ul :class="$style.list">
        <li v-for="post in posts" :key="post.source" :class="$style.item">
            <a :href="'./' + getSlug(post.source)" :class="$style.link">
                <span :class="$style.title">{{ post.title }}</span>
                <span v-if="post.published" :class="$style.date">{{ post.published }}</span>
            </a>
        </li>
    </ul>
</template>

<style module>
.list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.item {
    margin: 0;
}

.link {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 0;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid var(--vp-c-divider);
    gap: 12px;
}

.link:hover {
    color: var(--vp-c-brand);
}

.title {
    flex: 1;
    min-width: 0;
}

.date {
    color: var(--vp-c-text-2);
    font-size: 0.85em;
    white-space: nowrap;
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .link {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }

    .date {
        font-size: 0.8em;
    }
}
</style>