<template>
  <div class="project-details">
    <p>
      Powered by
    </p>
    <div class="logos">
      <a href="https://ably.com" target="_blank">
        <img src="../assets/ably-logo.png" alt="Ably logo" class="logo-image"
      /></a>
      <a href="https://strapi.io" target="_blank">
        <img
          src="../assets/strapi-logo.png"
          alt="Strapi logo"
          class="logo-image"
        />
      </a>
      <a href="https://www.netlify.com/" target="_blank">
        <img
          src="../assets/netlify-logo.png"
          alt="Netlify logo"
          class="logo-image"
        />
      </a>
    </div>
    <div class="mx-auto my-2 text-center">
      <gh-btns-star
        slug="ably-labs/jamstack-sync-stream-video"
        show-count
        class="gh-btn"
      ></gh-btns-star>
      <gh-btns-fork
        slug="ably-labs/jamstack-sync-stream-video"
        show-count
        class="gh-btn"
      ></gh-btns-fork>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.project-details {
  @apply fixed bottom-0 my-2 text-sm text-gray-700 mx-10;
}

.logos {
  @apply w-full flex justify-center;
}
.logo-image {
  @apply h-6 m-2;
}

.ref-link {
  @apply text-blue-700;
}

.gh-btn {
  float: none;
}

@screen md {
  .logo-image {
    @apply h-12 m-2;
  }
}
</style>
