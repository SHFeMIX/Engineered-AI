<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
    <div v-if="frontmatter && Object.keys(frontmatter).length > 0" :class="$style.container">
        <div :class="$style.header">
            <span :class="$style.badge">Meta</span>
        </div>
        <div v-for="(value, key) in frontmatter" :key="key" :class="$style.item">
            <span :class="$style.key">{{ key }}:</span>
            <a v-if="key === 'source' && value" :href="value" :class="$style.link" target="_blank"
                rel="noopener noreferrer">{{ value }}</a>
            <span v-else :class="$style.value">{{ value }}</span>
        </div>
    </div>
</template>

<style module>
.container {
    position: relative;
    margin: 20px 0;
    padding: 16px 16px 14px;
    background: linear-gradient(135deg,
            var(--vp-c-bg-soft) 0%,
            var(--vp-c-bg-elv, var(--vp-c-bg)) 100%);
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 4px 12px rgba(0, 0, 0, 0.04);
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--vp-c-divider);
}

.badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 20px;
}

.item {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 6px 0;
    font-size: 13px;
    line-height: 1.5;
}

.item:not(:last-child) {
    border-bottom: 1px dashed var(--vp-c-divider);
}

.key {
    flex-shrink: 0;
    font-weight: 600;
    color: var(--vp-c-text-2);
    min-width: 65px;
}

.value {
    color: var(--vp-c-text-1);
    word-break: break-word;
}

.link {
    color: var(--vp-c-brand-1);
    text-decoration: none;
    font-weight: 500;
    word-break: break-all;
    transition: color 0.2s ease;
}

.link:hover {
    color: var(--vp-c-brand-2);
    text-decoration: underline;
}

/* VitePress 断点: 960px (平板) */
@media (min-width: 960px) {
    .container {
        padding: 20px 20px 16px;
    }

    .item {
        font-size: 14px;
    }

    .key {
        min-width: 75px;
    }
}

/* VitePress 断点: 1280px (大桌面) */
@media (min-width: 1280px) {
    .container {
        padding: 22px 24px 18px;
    }
}
</style>