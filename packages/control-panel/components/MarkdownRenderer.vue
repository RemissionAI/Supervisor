<script setup lang="ts">
import MarkdownIt from 'markdown-it'

defineProps({
  source: {
    type: String,
    default: '',
  },
})

const markdown = new MarkdownIt()
</script>

<template>
  <div class="markdown-content" v-html="markdown.render(source)" />
</template>

<style lang="scss" scoped>
.markdown-content {
    max-width: 100%;
    overflow-x: auto;

    h1,
    h2,
    h3,
    h4 {
        margin-top: 1em;
        margin-bottom: 0.5em;
        font-weight: 600;
        line-height: 1.2;
    }

    h1 {
        font-size: 2em;
    }

    h2 {
        font-size: 1.5em;
    }

    h3 {
        font-size: 1.17em;
    }

    h4 {
        font-size: 1em;
    }

    p {
        margin-top: 0;
        margin-bottom: 1em;
    }

    ul,
    ol {
        margin-top: 0;
        margin-bottom: 2em;
    }

    li {
        margin-top: 0.25em;
    }

    img {
        max-width: 100%;
        height: auto;
        margin-top: 2em;
    }

    pre,
    code {
        font-family: monospace;
    }

    pre {
        padding: 1em;
        background-color: #f5f5f5;
        border-radius: 5px;
        overflow: auto;
    }

    code {
        padding: 0.2em 0.4em;
        background-color: #f1f1f1;
        border-radius: 3px;
    }

    blockquote {
        padding: 0 1em;
        color: #6a737d;
        border-left: 0.25em solid #dfe2e5;
        margin: 0;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 0.5em;
        border: 1px solid #ddd;
    }

    th {
        font-weight: bold;
        background-color: #f8f8f8;
    }

    a {
        color: #0366d6;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
