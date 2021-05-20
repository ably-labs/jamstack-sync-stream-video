<template>
  <div class="project-details">
    <h1 class="title">
      Live watch party
    </h1>
    <h2 class="subtitle">See synchronized videos with your friends</h2>
    <h3 class="subtext">Realtime JAMstack demo</h3>
  </div>
</template>

<style scoped lang="postcss">
.project-details {
  @apply fixed top-0 my-2 text-black;
}

.title {
  @apply text-4xl font-semibold text-black;
}

.subtitle {
  @apply text-lg mx-8 font-normal text-black;
}

.subtext {
  @apply text-sm m-1 font-normal text-black;
}

@screen md {
  .title {
    @apply text-6xl font-semibold text-black;
  }

  .subtitle {
    @apply text-2xl mx-0 font-normal;
  }

  .subtext {
    @apply text-base m-1;
  }
}
</style>
